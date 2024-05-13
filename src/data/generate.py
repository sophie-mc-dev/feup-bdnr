import datetime
from datetime import datetime, timedelta
from faker import Faker
import random
import json

fake = Faker()

def generate_random_date():
    current_year =  datetime.now().year
    start_date = datetime(current_year, 1, 1)
    end_date = datetime(current_year, 12, 31)

    # Generate a random hour and number of days and add it to the start date
    random_days = random.randint(0, (end_date - start_date).days)
    random_hour = random.randint(0, 23)
    random_minute = random.choice([0, 30])
    random_date = start_date + timedelta(days=random_days, hours=random_hour, minutes=random_minute)

    return random_date.isoformat()

def generate_comment_date():
    current_date = datetime.now()
    start_date = current_date - timedelta(days=180)
    end_date = current_date

    random_date = fake.date_time_between_dates(datetime_start=start_date, datetime_end=end_date)

    return random_date.isoformat()

def generate_transaction_date(earliest_event_date):
    current_date = datetime.now()
        
    if earliest_event_date > current_date:
        upper_bound = current_date
        lower_bound = current_date - timedelta(days=120)
    else:
        upper_bound = earliest_event_date - timedelta(days=1) 
        lower_bound = earliest_event_date - timedelta(days=60)
    
    # Generate the purchase date within the range between the upper and lower bounds
    transaction_date = fake.date_time_between_dates(datetime_start=lower_bound, datetime_end=upper_bound)
    return transaction_date.strftime("%Y-%m-%dT%H:%M:%S")

# don't forget that a user can have at most one transaction with the status shoppingCart
def generate_transaction_data(num_purchases, num_shopping_cart):
    transactions = []
    for _ in range(num_purchases):
        purchase = {
            "transaction_id": fake.unique.random_number(digits=6),
            "transaction_date": "", #will be filled later
            "transaction_status": "purchased",
            "user_id": "",  # will be filled later when the users are created
            "items": [] # will be filled later when the events and type of tickets are created
        }
        transactions.append(purchase)

    for _ in range(num_shopping_cart):
        shopping_cart = {
            "transaction_id": fake.unique.random_number(digits=6),
            "transaction_date": "", #will be filled later
            "transaction_status": "shopping_cart",
            "user_id": "",  # will be filled later when the users are created
            "items": [] # will be filled later when the events and type of tickets are created
        }
        transactions.append(shopping_cart)
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
            "organization_id": "", # will be filled later when organizations are created
            "event_name": event_data['event_name'],
            "description": event_data['description'],
            "date": generate_random_date(),
            "address": fake.address(),
            "location": "",  # will be filled later when the locations are created,
            "categories": event_data['categories'], 
            "num_likes": 0, # will be incremented every time a user likes the event
            "ticket_types": event_data['ticket_types'],
        }
        events.append(event)
    return events


def generate_user_data(num_consumers, num_organizations):
    users = []
    for _ in range(num_consumers):
        name = fake.unique.name()
        username = name.lower().replace(" ", "_")
        email = username + "@example.com"
        
        user = {
            "user_id": fake.unique.random_number(digits=6),
            "name": name,
            "username": username,
            "email": email,
            "password": "password",
            "is_organization": False,
            "liked_events": [],
            "comments": []
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
            "date": generate_comment_date(),
            "text": fake.text(),
            "event_id": "",
            "event_name": "",
        }
        comments.append(comment)
    return comments


def generate_document():
    categories = generate_category_data('./input_data/events.json')
    locations = read_locations_from_json('./input_data/locations.json')
    artists = generate_artist_data('./input_data/artist_names.json', './input_data/artist_songs.json')

    events = generate_event_data('./input_data/events.json')
    users = generate_user_data(1500, 250)
    comments = generate_comment_data(5000)

    transactions = generate_transaction_data(3000, 750)

    # Assign ids
    categories = [{"category_id": str(i + 1), **category} for i, category in enumerate(categories)]
    artists = [{"artist_id": str(i + 1), **artist} for i, artist in enumerate(artists)]
    events = [{**event, "event_id": str(i + 1)} for i, event in enumerate(events)]
    users = [{**user, "user_id": str(i + 1)} for i, user in enumerate(users)]
    comments = [{**comment, "comment_id": str(i + 1)} for i, comment in enumerate(comments)]
    transactions = [{**transaction, "transaction_id": str(i + 1)} for i, transaction in enumerate(transactions)]

    # Get consumers and organizations
    consumers = [user for user in users if not user.get("is_organization", False)]
    organizations = [user for user in users if user.get("is_organization") is True]

    # Assign a random list of liked events for each consumer
    for consumer in consumers:
        if consumer.get("is_organization", False) is False:
            random_liked_events = random.sample(events, random.randint(0, 20))
            for random_event in random_liked_events:
                consumer["liked_events"].append(random_event["event_id"])
                random_event["num_likes"] += 1

    # Assign a random consumer and event to each comment
    for comment in comments:
        random_event = random.choice(events)
        comment["event_id"] =  random_event["event_id"]
        comment["event_name"] =  random_event["event_name"]

        random_consumer = random.choice(consumers)
        random_consumer["comments"].append(comment)

    # Assign organization and location of each event
    for event in events:
        random_organization = random.choice(organizations)
        event["organization_id"] =  random_organization["user_id"]

        random_event_location = random.choice(locations)
        event["location"] = random_event_location["city_name"]

        if ("Music" in event["categories"]):
            random_event_artists = random.sample(artists, random.randint(1, 6))
            for random_artist in random_event_artists:
                event.setdefault("artists", []).append(random_artist["artist_name"]) 
                random_artist["event_ids"].append(event["event_id"])
    
    # Assign consumer and items of each transaction
    consumers_without_shopping_cart = [user for user in users if not user.get("is_organization", False)]
    for transaction in transactions:
        # assign a customer to the transaction, considering that each consumer can only have at most one shopping cart
        if (transaction["transaction_status"] == "purchased"):
            random_consumer = random.choice(consumers)
            transaction["user_id"] =  random_consumer["user_id"]
        else:
            # assign a consumer with no shopping cart
            random_consumer = random.choice(consumers_without_shopping_cart)
            transaction["user_id"] =  random_consumer["user_id"]
            consumers_without_shopping_cart.remove(random_consumer)

        # generate items
        num_items = random.randint(1, 5)
        transaction_event_dates = []
        
        for _ in range(num_items):
            random_event = random.choice(events)
            random_ticket_type =  random.choice(random_event["ticket_types"])
            random_quantity = random.randint(1, 5)
            new_item = {
                "event_id": random_event["event_id"],
                "event_name": random_event["event_name"],
                "event_date": random_event["date"],
                "ticket_type": random_ticket_type["ticket_type"],
                "ticket_price": random_ticket_type["price"],
                "quantity": random_quantity
            }
            transaction["items"].append(new_item)
            transaction_event_dates.append(datetime.strptime(random_event["date"], "%Y-%m-%dT%H:%M:%S"))
        
        # assign the transaction date
        earliest_event_date = min(transaction_event_dates)
        transaction["transaction_date"] = generate_transaction_date(earliest_event_date)

    return categories, locations, artists, events, users, transactions


if __name__ == "__main__":
    categories, locations, artists, events, users, transactions = generate_document()

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

    with open("./generated_data/transactions.json", "w") as file:
        json.dump(transactions, file, indent=4)

    print("JSON documents generated and saved to the generated_data folder.")
    print("Num categories: ", len(categories))
    print("Num locations: ", len(locations))
    print("Num artists: ", len(artists))
    print("Num events: ", len(events))
    print("Num users: ", len(users))