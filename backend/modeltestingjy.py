from transformers import AutoModelForCausalLM, AutoTokenizer, TextStreamer
import torch
from peft import PeftModel, PeftConfig
import firebase_admin
from firebase_admin import credentials, firestore
import re

# Firebase setup
cred = credentials.Certificate(r"C:\Users\eskim\Desktop\SummerProject\Front end\mcqs_generator\backend\mcqgenerator-cf6a7-firebase-adminsdk-775oq-80fd8ba5e0.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def save_question_to_firestore(question, options, answer):
    doc_ref = db.collection('questions').document()
    doc_ref.set({
        'question': question,
        'option': options,  # Save options as an array
        'answer': answer
    })

# Model setup
local_save_directory = r"C:\Users\eskim\Desktop\SummerProject\Backend"
config = PeftConfig.from_pretrained(local_save_directory)
base_model_name = config.base_model_name_or_path
base_model = AutoModelForCausalLM.from_pretrained(base_model_name)
tokenizer = AutoTokenizer.from_pretrained(base_model_name)
model = PeftModel.from_pretrained(base_model, local_save_directory)

# Generate question
input_context = "GDP"
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
{{}}

### Input:
{input_context}

### Response:
{{}}
"""

inputs = tokenizer(text, return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=512, use_cache=True)
output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

# Process the output_text to extract the question, options, and answer
def parse_output(output):
    # Match the question pattern
    question_pattern = re.compile(r"Question:\n(.*?)\nA", re.DOTALL)
    question_match = question_pattern.search(output)
    question = question_match.group(1).strip() if question_match else ""

    # Match the options pattern
    options_pattern = re.compile(r"A (.*?)\nB (.*?)\nC (.*?)\nD (.*?)\n", re.DOTALL)
    options_match = options_pattern.search(output)
    options = [options_match.group(i).strip() for i in range(1, 5)] if options_match else []

    # Match the answer pattern
    answer_pattern = re.compile(r"Key Answer: ([ABCD])")
    answer_match = answer_pattern.search(output)
    answer_letter = answer_match.group(1).strip() if answer_match else ""
    answer_dict = {"A": 0, "B": 1, "C": 2, "D": 3}
    answer = answer_dict.get(answer_letter, -1)

    return question, options, answer

question, options, answer = parse_output(output_text)

# Save to Firestore
if question and options and answer != -1:
    save_question_to_firestore(question, options, answer)
else:
    print("Failed to parse the generated text.")

print("Question saved to Firestore:", question)