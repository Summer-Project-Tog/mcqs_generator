from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from peft import PeftModel, PeftConfig

# Specify the directory where the adapter config and model are saved
local_save_directory = r"C:\Users\eskim\Desktop\SummerProject\Backend"

# Load the adapter configuration
config = PeftConfig.from_pretrained(local_save_directory)

# Load the base model
base_model_name = config.base_model_name_or_path
base_model = AutoModelForCausalLM.from_pretrained(base_model_name)

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(base_model_name)

# Load the adapter model
model = PeftModel.from_pretrained(base_model, local_save_directory)

# Now you can use the model and tokenizer for inference
# For example, let's run a sample text through the model

text = """Below is a set of notes, paired with an input that provides further context. Given the information provided by the notes, along with the input for further context,
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
{}

### Input:
{}

### Response:
{}"""
inputs = tokenizer(text, return_tensors="pt")

# Perform inference
outputs = model.generate(**inputs, max_length=100)

# Decode the generated tokens to get the output text
output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

# Print the output text
print(output_text)