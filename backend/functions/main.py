# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options, firestore_fn
from firebase_admin import firestore, credentials, initialize_app
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from peft import PeftModel, PeftConfig
import json
import uuid
from flask import jsonify, make_response



cred = credentials.Certificate("serviceAccountKey.json")
initialize_app(cred)
firestore_client = firestore.client()


@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("Hello world!")

# @https_fn.on_request(cors = options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]))
# def addmessage(req: https_fn.Request) -> https_fn.Response:
#     """Take the text parameter passed to this HTTP endpoint and insert it into
#     a new document in the messages collection."""
#     request_data = json.loads(req.data.decode("utf-8"))

#     # Grab the text parameter.
#     original = request_data.get("text")
#     if original is None:
#         return https_fn.Response("No text parameter provided", status=400)

#     firestore_client: google.cloud.firestore.Client = firestore.client()

#     # Push the new message into Cloud Firestore using the Firebase Admin SDK.
#     _, doc_ref = firestore_client.collection("messages").add({"original": original})

#     # Send back a message that we've successfully written the message
#     return https_fn.Response(f"Message with ID {doc_ref.id} added.")

@https_fn.on_request(cors = options.CorsOptions(cors_origins="*", cors_methods=["POST"]))
def mcq(req: https_fn.Request) -> https_fn.Response:
    request_data = json.loads(req.data.decode("utf-8"))
    notes = request_data.get("notes")
    if notes is None:
        return make_response(jsonify({"Error": "No notes parameter provided"}), 500)

    if not torch.cuda.is_available():
        return make_response(jsonify({"Error": "No GPU detected"}), 500)

    model_directory = r"./models"
    config = PeftConfig.from_pretrained(model_directory)

    base_model_name = config.base_model_name_or_path
    base_model = AutoModelForCausalLM.from_pretrained(base_model_name)  # Do not move to CUDA here

    tokenizer = AutoTokenizer.from_pretrained(base_model_name)
    model = PeftModel.from_pretrained(base_model, model_directory)  # Do not move to CUDA here

    # Move model to GPU if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    # Generate the MCQ
    max_retries = 10
    input_context = ""
    num_questions = 3
    questions = []

    for question_count in range(num_questions):
        for attempt in range(max_retries):
            try:
                cleaned_output = generate_mcq(model, tokenizer, notes, input_context, device)
                output_dict = parse_output(cleaned_output)

                # Check if the answer is valid
                if output_dict["answer"] < 0 or output_dict["answer"] >= len(output_dict["options"]):
                    raise ValueError("Invalid answer index")

                questions.append(output_dict)
                print("==========================")
                print(output_dict)
                break
            except Exception as e:
                print(f"Error on attempt {attempt + 1}: {e}")
                if attempt == max_retries - 1:
                    print("Max retries reached. Could not generate a valid MCQ.")
                continue
    
    if not questions:
        return make_response(jsonify({"Error": "Failed to generate MCQ"}), 500)
           

    
    # Generate a random ID for the question set
    question_set_id = str(uuid.uuid4())

    # Add dictionaries to Firestore
    # No other choice besides having 3 layers before each individual questions, 
    # since firebase must be collection -> document -> collection -> document
    question_set_ref = firestore_client.collection("mcqQuestions").document(question_set_id)
    doc_ids = []

    # Add each question as a document under the question set
    for index, question in enumerate(questions):
        _, doc_ref = question_set_ref.collection("questions").add({
            "question": question.get("question"),
            "options": question.get("options"),
            "answer": question.get("answer")
        })
        doc_ids.append(doc_ref.id)
        
    # del questions, notes, request_data, question_set_ref  # Clear memory
    # gc.collect()

    # Create the response
    response = {
        "message": "Questions generated and added successfully.",
        "question_set_id": question_set_id,
        "doc_ids": doc_ids
    }
    return make_response(jsonify(response), 200)


def generate_mcq(model, tokenizer, notes, input_context, device):
    text = f"""Below is a set of notes, paired with an input that provides further context. Given the information provided by the notes, along with the input for further context,
Create a multiple-choice question related to the query given in the form of:

Question?
A
[Option A]
B
[Option B]
C
[Option C]
D
[Option D]
Key Answer: [Correct option]

### notes:
{notes}

### Input:
{input_context}

### Response:
"""
    inputs = tokenizer(text, return_tensors="pt").to(device)  # Ensure tensors are on GPU
    with torch.no_grad():  # Use no_grad to avoid storing gradients
        outputs = model.generate(**inputs, max_new_tokens=256, use_cache=True)
    output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    start_keyword = "### Response:"
    start_index = output_text.find(start_keyword)
    if start_index != -1:
        start_index += len(start_keyword)
        cleaned_output = output_text[start_index:].strip()
    else:
        cleaned_output = output_text.strip()
        
    # del inputs, outputs  # Free up GPU memory
    # gc.collect()  # Perform garbage collection
    # torch.cuda.empty_cache()  # Empty CUDA cache

    print("==========================")
    print(cleaned_output)
    
    return cleaned_output

def parse_output(cleaned_output):
    lines = [line.strip() for line in cleaned_output.split('\n') if line.strip()]  # Remove empty lines
    
    # Extracting the question line
    question_line = next(line for line in lines if line.startswith("Question"))

    # Finding the index of the question line
    question_index = lines.index(question_line)

    # Extracting the options lines
    options_lines = lines[question_index + 1 : -1]  # All lines between question and key answer

    # Extracting the key answer from the last line
    key_answer_line = lines[-1]

    # Extracting the question
    question = question_line.replace("Question:", "").strip()

    # Extracting the options
    options = [line[line.find(" ") + 1:].strip() for line in options_lines if line.startswith(("A ", "B ", "C ", "D "))]
    # options = list(dict.fromkeys(options)) # purpose is to remove duplicates but very buggy

    # Extracting the key answer
    key_letter = key_answer_line.split()[-1]  # Extract the last word
    key_answer_index = ord(key_letter) - ord('A')

    # Creating the dictionary
    output_dict = {
        "question": question,
        "options": options,
        "answer": key_answer_index
    }
    
    
    # del lines, question_line, question_index, options_lines, key_answer_line  # Clear memory
    # gc.collect()

    return output_dict