from transformers import AutoModelForCausalLM, AutoTokenizer, TextStreamer
import torch
from peft import PeftModel, PeftConfig

# Specify the directory where the adapter config and model are saved
local_save_directory = r"D:\Coding\Summer Project\Backend"

# Load the adapter configuration
config = PeftConfig.from_pretrained(local_save_directory)

# Load the base model
base_model_name = config.base_model_name_or_path
base_model = AutoModelForCausalLM.from_pretrained(base_model_name)

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(base_model_name)

# Load the adapter model
model = PeftModel.from_pretrained(base_model, local_save_directory)

# Function to generate a multiple-choice question
def generate_mcq(notes, input_context):
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
    inputs = tokenizer(text, return_tensors="pt").to("cuda")
    outputs = model.generate(**inputs, max_new_tokens=256, use_cache=True)
    output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    start_keyword = "### Response:"
    start_index = output_text.find(start_keyword)
    if start_index != -1:
        start_index += len(start_keyword)
        cleaned_output = output_text[start_index:].strip()
    else:
        cleaned_output = output_text.strip()

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

    return output_dict




# Retry mechanism
max_retries = 5
input_context = ""
notes = "What is Inflation? It is nothing but an increase in the general level of price of the goods and/ or services in an economy over a certain period of time. As per the law of Economics, when the general level of prices increase, each unit of currency buys a decreased number of goods and services. Hence, inflation also reflects a decrease in the purchasing power of money. In the world of Economics, the word ‘inflation’ literally means a general price rise against a standard level of the purchasing power. As per Crowther’s findings, “Inflation is a state in which the value of money is falling and the prices are rising”."

for attempt in range(max_retries):
    try:
        cleaned_output = generate_mcq(notes, input_context)
        output_dict = parse_output(cleaned_output)

        # Check if the answer is valid
        if output_dict["answer"] < 0 or output_dict["answer"] >= len(output_dict["options"]):
            raise ValueError("Invalid answer index")

        print("==========================")
        print(output_dict)
        break
    except Exception as e:
        print(f"Error on attempt {attempt + 1}: {e}")
        if attempt == max_retries - 1:
            print("Max retries reached. Could not generate a valid MCQ.")
        continue