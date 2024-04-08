# Import users
echo; echo "Step 1: Importing 'users' collection ..."

docker cp ./data/users.json couchbase1:/tmp/users.json
docker exec couchbase1 cbimport json --format list -c http://localhost:8091 -u Administrator -p password -d 'file:///tmp/users.json' -b 'default' --scope-collection-exp "_default.users" -g %user_id% 
docker exec couchbase1 rm /tmp/users.json


# Import categories
echo; echo "Step 2: Importing 'categories' collection ..."

docker cp ./data/categories.json couchbase1:/tmp/categories.json
docker exec couchbase1 cbimport json --format list -c http://localhost:8091 -u Administrator -p password -d 'file:///tmp/categories.json' -b 'default' --scope-collection-exp "_default.categories" -g %category_id% 
docker exec couchbase1 rm /tmp/categories.json


# Import locations
echo; echo "Step 3: Importing 'locations' collection ..."

docker cp ./data/locations.json couchbase1:/tmp/locations.json
docker exec couchbase1 cbimport json --format list -c http://localhost:8091 -u Administrator -p password -d 'file:///tmp/locations.json' -b 'default' --scope-collection-exp "_default.locations" -g %location_id% 
docker exec couchbase1 rm /tmp/locations.json


# Import events
echo; echo "Step 4: Importing 'events' collection ..."

docker cp ./data/events.json couchbase1:/tmp/events.json
docker exec couchbase1 cbimport json --format list -c http://localhost:8091 -u Administrator -p password -d 'file:///tmp/events.json' -b 'default' --scope-collection-exp "_default.events" -g %event_id% 
docker exec couchbase1 rm /tmp/events.json