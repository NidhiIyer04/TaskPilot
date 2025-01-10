import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
import random
import time

# Load environment variables
load_dotenv()

# Set your API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load the training data
with open("sample_data.json", "r") as f:
    training_data = json.load(f)

# Select the base model for fine-tuning
base_model = [
    m for m in genai.list_models()
    if "createTunedModel" in m.supported_generation_methods and "flash" in m.name
][0]

print("Selected Base Model:", base_model.name)

# Generate a unique name for the tuned model
name = f"insurance-bot-{random.randint(1000, 9999)}"

# Start the fine-tuning process
operation = genai.create_tuned_model(
    source_model=base_model.name,
    training_data=training_data,
    id=name,
    epoch_count=10,
    batch_size=4,
    learning_rate=0.001,
)

print("Tuning operation started. Model ID:", name)

# Wait for the tuning to complete
for status in operation.wait_bar():
    time.sleep(30)

print("Tuning completed!")

# # Get and test the tuned model
# model = genai.get_tuned_model(f"tunedModels/{name}")
# model = genai.GenerativeModel(model_name=f'tunedModels/{name}')
# result = model.generate_content("Can you tell me the due date for my health insurance premium?")
# print("Model Response:", result.text)

# # Update the model description
# genai.update_tuned_model(model.name, {"description": "This is my insurance bot model."})
