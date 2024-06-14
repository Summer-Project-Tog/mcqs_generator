from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import gc

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from peft import PeftModel, PeftConfig
import json
import firebase_admin
from firebase_admin import firestore, credentials
import uuid

app = Flask(__name__)
cors = CORS(app, origins="*")
## CORS configures the server to allow requests from any (*) origin

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
firestore_client = firestore.client()

@app.route("/api/users", methods=["GET"])
def users():
    return jsonify({"users": ["Alice", "Bob", "Charlie"]})

@app.route("/api/mcq", methods=["POST"])
def mcq():
    request_data = request.get_json()
    notes = request_data.get("notes")
    if notes is None:
        return make_response(jsonify({"error": "No text parameter provided"}), 400)

    if not torch.cuda.is_available():
        return jsonify({"error": "No GPU detected"}), 400

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
        return make_response(jsonify({"error": "Failed to generate MCQ"}), 400) 
           

    
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
        
    del questions, notes, request_data, question_set_ref  # Clear memory
    gc.collect()

    # The question_set_id can be used to retrieve the question set from Firestore and show it on the MCQ page
    return jsonify({"message": "Questions generated and added successfully.",
                    "question_set_id": question_set_id,
                    "doc_ids": doc_ids})



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
        
    del inputs, outputs  # Free up GPU memory
    gc.collect()  # Perform garbage collection
    torch.cuda.empty_cache()  # Empty CUDA cache

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
    
    
    del lines, question_line, question_index, options_lines, key_answer_line  # Clear memory
    gc.collect()

    return output_dict

if __name__ == "__main__":
    app.run(debug = True, port = 8080)