import json
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions
from couchbase.auth import PasswordAuthenticator


def connect_to_couchbase():
    # Connection parameters
    server_address = "couchbase://localhost"
    username = "Administrator"
    password = "password"
    bucket_name = "default"

    # Initialize Cluster
    authenticator = PasswordAuthenticator(username, password)
    cluster = Cluster(server_address, ClusterOptions(authenticator))

    bucket = cluster.bucket(bucket_name)
    collection = bucket.default_collection()

    print("Connected to Couchbase successfully")

    return collection


""" 
FUNCTION NOT UPDATED! 
"""
def import_documents(collection):
    # Read JSON file
    with open("couchbase_documents.json", "r") as file:
        documents = json.load(file)

    # Upsert each document into the Couchbase bucket
    for key, document in documents.items():
        collection.upsert(key, document)

    print("Documents imported successfully.")


if __name__ == "__main__":
    try:
        collection = connect_to_couchbase()
        # import_documents(collection)
    except Exception as e:
        print(f"Unexpected error: {e}")
