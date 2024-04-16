import json

def remove_duplicates(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    unique_data = list(set(json.dumps(item) for item in data))
    unique_data = [json.loads(item) for item in unique_data]

    with open(file_path, 'w') as file:
        json.dump(unique_data, file, indent=4)

# Example usage
remove_duplicates('./input_data/artist_names.json')