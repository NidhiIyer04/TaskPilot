import json
import re

# Load JSON data from file
with open("sample_data.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Function to extract key details
def extract_details(entry):
    text = entry["text_input"]
    response = entry["output"]

    name_match = re.search(r"(?:this is|I am|my name is)\s+([A-Za-z\s]+)", text, re.IGNORECASE)
    policy_match = re.search(r"policy number is\s+([A-Z0-9]+)", text, re.IGNORECASE)
    claim_match = re.search(r"claim number is\s+([0-9]+)", text, re.IGNORECASE)
    due_date_match = re.search(r"due on\s+([A-Za-z0-9,\s]+)", response, re.IGNORECASE)

    return {
        "Caller Name": name_match.group(1).strip() if name_match else "Unknown",
        "Policy Number": policy_match.group(1) if policy_match else "N/A",
        "Claim Number": claim_match.group(1) if claim_match else "N/A",
        "Due Date": due_date_match.group(1) if due_date_match else "N/A",
        "Query": text,
        "Response": response
    }

# Process all entries
extracted_data = [extract_details(entry) for entry in data]

# Display structured output
for index, record in enumerate(extracted_data, start=1):
    print(f"Record {index}:")
    for key, value in record.items():
        print(f"  {key}: {value}")
    print("-" * 50)

# Save structured data to JSON file
with open("extracted_data.json", "w", encoding="utf-8") as outfile:
    json.dump(extracted_data, outfile, indent=4, ensure_ascii=False)

print("\nExtracted data saved to extracted_data.json")
