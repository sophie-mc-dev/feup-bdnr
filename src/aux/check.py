import json

def compare_json_files(file1, file2):
    with open(file1, 'r') as f1, open(file2, 'r') as f2:
        data1 = json.load(f1)
        data2 = json.load(f2)

    missing_values = []
    for value in data1:
        if value not in data2:
            missing_values.append(value)

    if missing_values:
        print("Values not found as keys in the second file:")
        for value in missing_values:
            print(value)
    else:
        print("All values from the first file are present as keys in the second file.")

# Usage example
compare_json_files('../data/input_data/artist_names.json', '../data/input_data/artist_musics.json')