import os
from dotenv import load_dotenv
import replicate
import asyncio
import functools
import re
from tqdm import tqdm
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load environment variables
load_dotenv()

REPLICATE_API_TOKEN = os.getenv('REPLICATE_API_TOKEN')
if not REPLICATE_API_TOKEN:
    print("Error: REPLICATE_API_TOKEN not found in environment variables.")
    exit(1)

TAG_FOLDER = "tags"  # Path to the tags folder
INPUT_FILE = "input.txt"  # Path to the input file
SIMILARITY_THRESHOLD = 0.5  # Similarity threshold for matching topics

def sanitize_filename(name: str) -> str:
    name = name.lower().strip()
    name = re.sub(r'[^a-z0-9\s]', '', name)
    name = re.sub(r'\s+', '_', name)
    return name

import threading

async def categorize_line(line: str) -> str:
    prompt = (
        "Based on the following blog idea, suggest the most appropriate 1-word category or topic: "
        f"{line}\nReturn only the category name."
    )

    input_params = {
        "top_p": 0.9,
        "prompt": prompt,
        "min_tokens": 0,
        "temperature": 0.6,
        "prompt_template": "...",
        "presence_penalty": 1.15
    }

    def stream_output():
        output = ""
        for event in replicate.stream(
            "meta/meta-llama-3-70b-instruct",
            input=input_params
        ):
            output += str(event)
        return output.strip()

    try:
        loop = asyncio.get_running_loop()
        category = await loop.run_in_executor(None, stream_output)
        print(f"Response from model: '{category}'")

        return sanitize_filename(category)
    except Exception as e:
        print(f"Error occurred during API request: {e}. Assigning to 'misc'.")
        return "misc"



# Function to read input file line by line
def read_input_file(filename: str):
    with open(filename, 'r', encoding='utf-8') as file:
        lines = [line.strip() for line in file if line.strip()]
    return lines

# Function to create or append to a tag file
def append_to_tag_file(tag: str, line: str, tag_folder: str, existing_topics: dict):
    existing_topics[tag].append(line)
    file_path = os.path.join(tag_folder, f"{tag}.md")

    # Write lines to the appropriate tag file
    with open(file_path, 'a', encoding='utf-8') as file:
        file.write(line + '\n\n')

# Function to calculate similarity between lines and existing topics
def calculate_similarity(new_topic: str, existing_topics: list) -> str:
    if not existing_topics:
        return None

    vectorizer = TfidfVectorizer().fit_transform([new_topic] + existing_topics)
    similarity_matrix = cosine_similarity(vectorizer)
    similarities = similarity_matrix[0][1:]
    max_similarity_idx = similarities.argmax()
    if similarities[max_similarity_idx] >= SIMILARITY_THRESHOLD:
        return existing_topics[max_similarity_idx]
    return None

# Main function to process the input file
async def process_input_file(input_file: str, tag_folder: str):
    # Ensure the tag folder exists
    if not os.path.exists(tag_folder):
        os.makedirs(tag_folder)

    # Read lines from the input file
    lines = read_input_file(input_file)
    existing_topics = {f.split('.')[0]: [] for f in os.listdir(tag_folder) if f.endswith('.md')}

    # Process each line asynchronously
    with tqdm(total=len(lines), desc="Categorizing lines", unit="line") as pbar:
        tasks = []
        for line in lines:
            tasks.append(categorize_and_append(line, tag_folder, existing_topics, pbar))
        await asyncio.gather(*tasks)

import asyncio

# Add a lock for synchronizing access to existing_topics
existing_topics_lock = asyncio.Lock()

# Modify the categorize_and_append function to use the lock
async def categorize_and_append(line: str, tag_folder: str, existing_topics: dict, pbar):
    new_topic = await categorize_line(line)

    async with existing_topics_lock:
        similar_topic = calculate_similarity(new_topic, list(existing_topics.keys()))

        if similar_topic:
            append_to_tag_file(similar_topic, line, tag_folder, existing_topics)
        else:
            existing_topics[new_topic] = []
            append_to_tag_file(new_topic, line, tag_folder, existing_topics)

    pbar.update(1)


if __name__ == "__main__":
    # Process the input file
    asyncio.run(process_input_file(INPUT_FILE, TAG_FOLDER))