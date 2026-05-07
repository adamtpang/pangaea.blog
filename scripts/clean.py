import os
from tqdm import tqdm

SAVE_FILE = "save.txt"

def clean_save_file(save_file):
    # Check if the file exists
    if not os.path.exists(save_file):
        print(f"The file '{save_file}' does not exist.")
        return

    # Read lines from the file
    print(f"Reading lines from '{save_file}'...")
    with open(save_file, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # Remove duplicates and strip whitespace
    print("Removing duplicates and stripping whitespace...")
    unique_lines = list(set(line.strip() for line in lines if line.strip() != ""))

    # Sort lines by length
    print("Sorting lines by length...")
    sorted_lines = sorted(unique_lines, key=len)

    # Write cleaned lines back to the file with line breaks in between
    print("Writing cleaned and sorted lines back to the file...")
    with tqdm(total=len(sorted_lines), desc="Writing lines", unit="line") as pbar:
        with open(save_file, 'w', encoding='utf-8') as file:
            for line in sorted_lines:
                file.write(line + '\n\n')  # Adding an extra line break for separation
                pbar.update(1)

    print(f"File '{save_file}' has been cleaned, sorted by length, and saved.")

if __name__ == "__main__":
    clean_save_file(SAVE_FILE)
