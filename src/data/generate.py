from faker import Faker
import random
import json

topics = [
    "Music Concert",
    "Art Exhibition",
    "Film Festival",
    "Fashion Show",
    "Food Fair",
    "Technology Conference",
    "Sporting Event",
    "Charity Gala",
    "Comedy Show",
    "Poetry Reading",
    "Wine Tasting",
    "Dance Performance",
    "Theater Play",
    "Business Summit",
    "Cultural Festival",
    "Academic Symposium",
    "Product Launch",
    "Wellness Retreat",
    "Car Show",
    "Trade Expo",
]


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


def generate_category_data():
    categories = []
    for topic in topics:
        category = {
            "category_name": topic,
            "event_ids": [] # will be filled later when the events are created
        }
        categories.append(category)
    return categories


def generate_event_data(num_events):
    events = []
    for _ in range(num_events):
        event = {
            "event_id": fake.unique.random_number(digits=6),
            "event_name": generate_fake_event_name(),
            "date": fake.date_time_this_year().isoformat(),
            "address": fake.address(),
            "description": fake.text(),
            "categories": [], # will be populated by linking to a category
            "location": "",  # will be filled later when the locations are created
            "ticket_types": [], # will be filled later
            "comments": [] # will be filled later when the comments are created
        }
        events.append(event)
    return events


def generate_user_data(num_users):
    users = []
    for _ in range(num_users):
        user = {
            "user_id": fake.unique.random_number(digits=6),
            "name": fake.name(),
            "username": fake.user_name(),
            "email": fake.email(),
            "password": fake.password(),
            "liked_events": [] 
        }
        users.append(user)
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
    categories = generate_category_data()
    locations = read_locations_from_json('./input_generate/locations_input.json')

    events = generate_event_data(10000)
    users = generate_user_data(1500)
    comments = generate_comment_data(5000)
    replies = generate_reply_data(10000)

    # Assign ids
    categories = [{"category_id": i + 1, **category} for i, category in enumerate(categories)]
    events = [{**event, "event_id": i + 1} for i, event in enumerate(events)]
    users = [{**user, "user_id": i + 1} for i, user in enumerate(users)]
    comments = [{**comment, "comment_id": i + 1} for i, comment in enumerate(comments)]
    replies = [{**reply, "reply_id": i + 1} for i, reply in enumerate(replies)]

    # Assign a random list of liked events for each user
    for user in users:
        user["liked_events"] = random.sample(range(1, len(events) + 1), random.randint(1, 20))

    # Assign a random user to each comment
    for comment in comments:
        random_user = random.choice(users)
        comment["user_id"] = random_user["user_id"]
        comment["user_name"] = random_user["name"]

    # Assign a random user and comment to each reply 
    for reply in replies:
        random_user = random.choice(users)
        reply["user_id"] = random_user["user_id"]
        reply["user_name"] = random_user["name"]

        random_comment = random.choice(comments)
        random_comment["replies"].append(reply)
    
    # Assign each comment to a random event
    for comment in comments:
        random_event = random.choice(events)
        random_event["comments"].append(comment)

    # Assign location and categories of each event
    for event in events:
        random_event_location = random.choice(locations)
        event["location"] = random_event_location["city_name"]
        random_event_location.setdefault("event_ids", []).append(event["event_id"])

        random_event_categories =  random.sample(categories, random.randint(1, 3))
        for random_category in random_event_categories:
            event["categories"].append(random_category["category_name"])
            random_category["event_ids"].append(event["event_id"])

        # TODO: Assign ticket types for each event
        #

    

        # Add artists

        # Add Organization

    return categories, locations, events, users


if __name__ == "__main__":
    categories, locations, events, users = generate_document()

    with open("categories.json", "w") as file:
        json.dump(categories, file, indent=4)

    with open("locations.json", "w") as file:
        json.dump(locations, file, indent=4)

    with open("events.json", "w") as file:
        json.dump(events, file, indent=4)

    with open("users.json", "w") as file:
        json.dump(users, file, indent=4)

    # TODO: transactions 

    # TODO: artists

    print("JSON documents generated and saved to the data folder.")
