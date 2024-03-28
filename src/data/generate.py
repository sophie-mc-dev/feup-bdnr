from faker import Faker
import random
import json
from datetime import datetime

# still not finished, WIP

topics =["Music Concert",
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
            "Trade Expo"]


trans_status = ["shopping_cart", "purchased"]

fake = Faker()

# don't forget that a user can have at most one transaction with the status shoppingCart
def generate_transaction_data(num_transactions):
    transactions = []
    for _ in range(num_transactions):
        transaction = {
            "transaction_id": fake.unique.random_number(digits=6),
            "transaction_date": fake.date_time_this_year().isoformat(),
            "transaction_status": random.choice(trans_status)
        }
        transactions.append(transaction)
    return transactions



def generate_fake_event_name():
    return fake.catch_phrase()

def generate_fake_location():
    return fake.city()

def generate_location_data(num_locations):
    locations = []
    for _ in range(num_locations):
        city = generate_fake_location()
        locations.append({
            "city_name": city
        })
    return locations

def generate_category_data():
    categories = []
    for i in topics:
        category = {
            "category_name": i
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
            "available_tickets": random.randint(0, 1000),
            "ticket_price": random.randint(10, 1000),
            "address": fake.address(),
            "description": fake.text()
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
            "password": fake.password()
        }
        users.append(user)
    return users

def generate_comment_data(num_comments):
    comments = []
    for _ in range(num_comments):
        comment = {
            "comment_id": fake.unique.random_number(digits=6),
            "text": fake.text(),
            "replies": []
        }
        comments.append(comment)
    return comments

def generate_reply_data(num_replies):
    replies = []
    for _ in range(num_replies):
        reply = {
            "reply_id": fake.unique.random_number(digits=6),
            "text": fake.text()
        }
        replies.append(reply)
    return replies

def generate_document():
    categories = generate_category_data()
    locations = generate_location_data(5000)
    events = generate_event_data(10000)
    users = generate_user_data(1500)
    comments = generate_comment_data(5000)
    replies = generate_reply_data(10000)

    documents = {
        "categories": categories,
        "locations": locations,
        "events": events,
        "users": users,
        "comments": comments,
        "replies": replies
    }

    return documents

if __name__ == "__main__":
    documents = generate_document()
    with open('couchbase_documents.json', 'w') as file:
        json.dump(documents, file, indent=4, default=str)

    print("JSON documents generated and saved to couchbase_documents.json")
