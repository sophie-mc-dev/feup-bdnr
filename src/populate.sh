#!/bin/bash

source .env

# Import users
echo; echo "Step 1: Importing 'users' collection ..."

docker cp "$USERS_JSON_PATH" "$CONTAINER_NAME":/tmp/users.json
docker exec "$CONTAINER_NAME" cbimport json --format list -c "http://$COUCHBASE_HOST:$COUCHBASE_PORT" -u "$COUCHBASE_USERNAME" -p "$COUCHBASE_PASSWORD" -d 'file:///tmp/users.json' -b "$COUCHBASE_BUCKET_NAME" --scope-collection-exp "$COUCHBASE_SCOPE_NAME.users" -g %user_id%
docker exec "$CONTAINER_NAME" rm /tmp/users.json


# Import categories
echo; echo "Step 2: Importing 'categories' collection ..."

docker cp "$CATEGORIES_JSON_PATH" "$CONTAINER_NAME":/tmp/categories.json
docker exec "$CONTAINER_NAME" cbimport json --format list -c "http://$COUCHBASE_HOST:$COUCHBASE_PORT" -u "$COUCHBASE_USERNAME" -p "$COUCHBASE_PASSWORD" -d 'file:///tmp/categories.json' -b "$COUCHBASE_BUCKET_NAME" --scope-collection-exp "$COUCHBASE_SCOPE_NAME.categories" -g %category_id%
docker exec "$CONTAINER_NAME" rm /tmp/categories.json


# Import locations
echo; echo "Step 3: Importing 'locations' collection ..."

docker cp "$LOCATIONS_JSON_PATH" "$CONTAINER_NAME":/tmp/locations.json
docker exec "$CONTAINER_NAME" cbimport json --format list -c "http://$COUCHBASE_HOST:$COUCHBASE_PORT" -u "$COUCHBASE_USERNAME" -p "$COUCHBASE_PASSWORD" -d 'file:///tmp/locations.json' -b "$COUCHBASE_BUCKET_NAME" --scope-collection-exp "$COUCHBASE_SCOPE_NAME.locations" -g %location_id%
docker exec "$CONTAINER_NAME" rm /tmp/locations.json


# Import events
echo; echo "Step 4: Importing 'events' collection ..."

docker cp "$EVENTS_JSON_PATH" "$CONTAINER_NAME":/tmp/events.json
docker exec "$CONTAINER_NAME" cbimport json --format list -c "http://$COUCHBASE_HOST:$COUCHBASE_PORT" -u "$COUCHBASE_USERNAME" -p "$COUCHBASE_PASSWORD" -d 'file:///tmp/events.json' -b "$COUCHBASE_BUCKET_NAME" --scope-collection-exp "$COUCHBASE_SCOPE_NAME.events" -g %event_id%
docker exec "$CONTAINER_NAME" rm /tmp/events.json

# Import artists
echo; echo "Step 5: Importing 'artists' collection ..."

docker cp "$ARTISTS_JSON_PATH" "$CONTAINER_NAME":/tmp/artists.json
docker exec "$CONTAINER_NAME" cbimport json --format list -c "http://$COUCHBASE_HOST:$COUCHBASE_PORT" -u "$COUCHBASE_USERNAME" -p "$COUCHBASE_PASSWORD" -d 'file:///tmp/artists.json' -b "$COUCHBASE_BUCKET_NAME" --scope-collection-exp "$COUCHBASE_SCOPE_NAME.artists" -g %artist_name%
docker exec "$CONTAINER_NAME" rm /tmp/artists.json

# Import transactions
echo; echo "Step 6: Importing 'transactions' collection ..."

docker cp "$TRANSACTIONS_JSON_PATH" "$CONTAINER_NAME":/tmp/transactions.json
docker exec "$CONTAINER_NAME" cbimport json --format list -c "http://$COUCHBASE_HOST:$COUCHBASE_PORT" -u "$COUCHBASE_USERNAME" -p "$COUCHBASE_PASSWORD" -d 'file:///tmp/transactions.json' -b "$COUCHBASE_BUCKET_NAME" --scope-collection-exp "$COUCHBASE_SCOPE_NAME.transactions" -g %transaction_id%
docker exec "$CONTAINER_NAME" rm /tmp/transactions.json