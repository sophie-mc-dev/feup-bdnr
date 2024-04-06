#!/bin/bash

# Step 1: Pull Couchbase image
docker pull couchbase/server

# Step 2: Run Docker container
echo "Step 2: Running Docker container..."
docker run -d --name couchbase-bdnr-g04 \
    -p 8091-8093:8091-8093 \
    -e COUCHBASE_ADMINISTRATOR_USERNAME=Administrator \
    -e COUCHBASE_ADMINISTRATOR_PASSWORD=password \
    couchbase/server

# Wait for Couchbase to start up
echo "Waiting for Couchbase to start up..."
sleep 20

# Step 3: Configure Couchbase cluster
echo "Step 3: Configuring Couchbase cluster..."

curl -v -X POST http://127.0.0.1:8091/pools/default -d memoryQuota=512 -d indexMemoryQuota=512

sleep 5

curl -v http://127.0.0.1:8091/node/controller/setupServices -d services=kv%2Cn1ql%2Cindex

sleep 5

curl -v http://127.0.0.1:8091/settings/web -d port=8091 -d username=$COUCHBASE_ADMINISTRATOR_USERNAME -d password=$COUCHBASE_ADMINISTRATOR_PASSWORD

curl -i -u $COUCHBASE_ADMINISTRATOR_USERNAME:$COUCHBASE_ADMINISTRATOR_PASSWORD -X POST http://127.0.0.1:8091/settings/indexes -d 'storageMode=memory_optimized'

# Step 4: Create Couchbase bucket
echo "Step 4: Creating Couchbase bucket..."
curl -v -u $COUCHBASE_ADMINISTRATOR_USERNAME:$COUCHBASE_ADMINISTRATOR_PASSWORD -X POST http://127.0.0.1:8091/pools/default/buckets -d name=$COUCHBASE_BUCKET -d bucketType=couchbase -d ramQuotaMB=128 -d authType=sasl -d saslPassword=
echo "Couchbase setup completed successfully."

# Step 5: Display Docker logs
echo "Step 4: Displaying Docker logs..."
docker logs -f couchbase-bdnr-g04