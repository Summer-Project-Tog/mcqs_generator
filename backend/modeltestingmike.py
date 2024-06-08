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

# Now you can use the model and tokenizer for inference
# For example, let's run a sample text through the model

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

##### OUTPUT VERSION 1
# inputs = tokenizer(text, return_tensors="pt").to("cuda")
# text_streamer = TextStreamer(tokenizer)
# outputs = model.generate(**inputs, streamer = text_streamer, max_length=512)  #maybe can modify length
# print(outputs)

##### OUTPUT VERSION 2
inputs = tokenizer(text, return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens= 512, use_cache = True) #maybe can modify max_new_tokens
output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(output_text)