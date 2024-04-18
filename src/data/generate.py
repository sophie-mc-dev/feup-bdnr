from faker import Faker
import random
import json

trans_status = ["shopping_cart", "purchased"]

fake = Faker()

# don't forget that a user can have at most one transaction with the status shoppingCart
def generate_transaction_data(num_transactions):
    transactions = []
    for _ in range(num_transactions):
        transaction = {
            "transaction_id": fake.unique.random_number(digits=6),
            "transaction_date": fake.date_time_this_year().isoformat(),
            "transaction_status": random.choice(trans_status),
            "user_id": "",  # will be filled later when the users are created
            "items": [] # will be filled later when the events and type of tickets are created
        }
        transactions.append(transaction)
    return transactions


def generate_fake_event_name():
    return fake.catch_phrase()

def read_locations_from_json(file_path):
    with open(file_path, 'r') as file:
        locations = json.load(file)
    return locations

def generate_category_data(events_file_path):
    with open(events_file_path, 'r') as file:
        events = json.load(file)
    
    unique_categories = set()
    for event in events:
        unique_categories.update(event['categories'])

    categories = []
    for category_name in unique_categories:
        category = {
            "category_name": category_name,
            "event_ids": [] # will be filled later when the events are created
        }
        categories.append(category)
    return categories

def read_artists_from_json(file_path):
    with open(file_path, 'r') as file:
        artist_names = json.load(file)
    return artist_names

def read_songs_from_json(file_path):
    with open(file_path, 'r') as file:
        artist_songs = json.load(file)
    return artist_songs

def generate_artist_data(file_path, file_path2):
    artist_names = read_artists_from_json(file_path)
    artist_songs = read_songs_from_json(file_path2)
    artists = []
    for artist_name in artist_names:
        artist = {
            "artist_name": artist_name,
            "artist_biography": fake.text(),
            "artist_top5_music": artist_songs.get(artist_name, []),
            "event_ids": []  # will be filled later when the events are created
        }
        artists.append(artist)
    return artists


def generate_event_data(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    events = []
    for event_data in data:
        event = {
            "event_id": fake.unique.random_number(digits=6),
            "event_name": event_data['event_name'],
            "description": event_data['description'],
            "date": fake.date_time_this_year().isoformat(),
            "address": fake.address(),
            "location": "",  # will be filled later when the locations are created,
            "organization_id": "", # will be filled later when organizations are created
            "categories": event_data['categories'], 
            "ticket_types": event_data['ticket_types'],
            "comments": [] # will be filled later when the comments are created
        }
        events.append(event)
    return events


def generate_user_data(num_consumers, num_organizations):
    users = []
    for _ in range(num_consumers):
        user = {
            "user_id": fake.unique.random_number(digits=6),
            "name": fake.name(),
            "username": fake.unique.user_name(),
            "email": fake.unique.email(),
            "password": fake.password(),
            "is_organization": False,
            "liked_events": []
        }
        users.append(user)

    for _ in range(num_organizations):
        organization = {
            "user_id": fake.unique.random_number(digits=6),
            "name": fake.company(),
            "username": fake.unique.user_name(),
            "email": fake.unique.email(),
            "password": fake.password(),
            "is_organization": True
        }
        users.append(organization)

    return users


def generate_comment_data(num_comments):
    comments = []
    for _ in range(num_comments):
        comment = {
            "comment_id": fake.unique.random_number(digits=6),
            "user_id": "",
            "user_name": "",
            "text": fake.text(),
            "replies": [],   # will be filled later when the replies are created
        }
        comments.append(comment)
    return comments


def generate_reply_data(num_replies):
    replies = []
    for _ in range(num_replies):
        reply = {
            "reply_id": fake.unique.random_number(digits=6), 
            "user_id": "",
            "user_name": "",
            "text": fake.text()
        }
        replies.append(reply)
    return replies


def generate_document():
    categories = generate_category_data('./input_data/events.json')
    locations = read_locations_from_json('./input_data/locations.json')
    artists = generate_artist_data('./input_data/artist_names.json', './input_data/artist_songs.json')

    events = generate_event_data('./input_data/events.json')
    users = generate_user_data(1500, 250)
    comments = generate_comment_data(5000)
    replies = generate_reply_data(10000)

    # Assign ids
    categories = [{"category_id": i + 1, **category} for i, category in enumerate(categories)]
    artists = [{"artist_id": i + 1, **artist} for i, artist in enumerate(artists)]
    events = [{**event, "event_id": i + 1} for i, event in enumerate(events)]
    users = [{**user, "user_id": i + 1} for i, user in enumerate(users)]
    comments = [{**comment, "comment_id": i + 1} for i, comment in enumerate(comments)]
    replies = [{**reply, "reply_id": i + 1} for i, reply in enumerate(replies)]

    # Get consumers and organizations
    consumers = [user for user in users if not user.get("is_organization", False)]
    organizations = [user for user in users if user.get("is_organization") is True]

    # Assign a random list of liked events for each consumer
    for consumer in consumers:
        if consumer.get("is_organization", False) is False:
            consumer["liked_events"] = random.sample(range(1, len(events) + 1), random.randint(1, 20))

    # Assign a random consumer to each comment
    for comment in comments:
        random_consumer = random.choice(consumers)
        comment["user_id"] = random_consumer["user_id"]
        comment["user_name"] = random_consumer["name"]

    # Assign a random consumer and comment to each reply 
    for reply in replies:
        random_consumer = random.choice(consumers)
        reply["user_id"] = random_consumer["user_id"]
        reply["user_name"] = random_consumer["name"]

        random_comment = random.choice(comments)
        random_comment["replies"].append(reply)
    
    # Assign each comment to a random event
    for comment in comments:
        random_event = random.choice(events)
        random_event["comments"].append(comment)
    
    # Assign list of events for each category
    for category in categories:
        for event in events:
            if category["category_name"] in event["categories"]:
                category["event_ids"].append(event["event_id"])

    # Assign organization and location of each event
    for event in events:
        random_organization = random.choice(organizations)
        event["organization_id"] =  random_organization["user_id"]

        random_event_location = random.choice(locations)
        event["location"] = random_event_location["city_name"]
        random_event_location.setdefault("event_ids", []).append(event["event_id"])

        if ("Music" in event["categories"]):
            random_event_artists = random.sample(artists, random.randint(1, 6))
            for random_artist in random_event_artists:
                event.setdefault("artists", []).append(random_artist["artist_name"]) 
                random_artist["event_ids"].append(event["event_id"])

    return categories, locations, artists, events, users


if __name__ == "__main__":
    categories, locations, artists, events, users = generate_document()

    with open("./generated_data/categories.json", "w") as file:
        json.dump(categories, file, indent=4)

    with open("./generated_data/locations.json", "w") as file:
        json.dump(locations, file, indent=4)
    
    with open("./generated_data/artists.json", "w") as file:
        json.dump(artists, file, indent=4)

    with open("./generated_data/events.json", "w") as file:
        json.dump(events, file, indent=4)

    with open("./generated_data/users.json", "w") as file:
        json.dump(users, file, indent=4)

    # TODO: transactions 

    print("JSON documents generated and saved to the generated_data folder.")
    print("Num categories: ", len(categories))
    print("Num locations: ", len(locations))
    print("Num artists: ", len(artists))
    print("Num events: ", len(events))
    print("Num users: ", len(users))