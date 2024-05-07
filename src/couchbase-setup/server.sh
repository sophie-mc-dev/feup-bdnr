#!/bin/bash

source .env

# Step 1: Pull Couchbase image
echo "Step 1: Pulling Couchbase image..."
docker pull "$COUCHBASE_IMAGE"

# Step 2: Run Docker container
echo; echo "Step 2: Running Docker container..."
docker run -d --name "$CONTAINER_NAME" -p 8091-8094:8091-8094 -p 11210:11210 couchbase/server

# Wait for Couchbase to start up
echo; echo "Waiting for Couchbase to start up..."
sleep 30

# Step 3: Configure Couchbase cluster
echo; echo "Step 3: Configuring Couchbase cluster..."

curl -v -X POST http://127.0.0.1:8091/pools/default -d memoryQuota=512 -d indexMemoryQuota=512

sleep 5

curl -v http://127.0.0.1:8091/node/controller/setupServices -d services=kv%2Cn1ql%2Cindex%2Cfts

sleep 5

curl -v http://127.0.0.1:8091/settings/web -d port=8091 -d "username=$COUCHBASE_USERNAME" -d "password=$COUCHBASE_PASSWORD"

curl -i -u "$COUCHBASE_USERNAME:$COUCHBASE_PASSWORD" -X POST http://127.0.0.1:8091/settings/indexes -d 'storageMode=memory_optimized'

# Step 4: Create Couchbase bucket
echo; echo "Step 4: Creating Couchbase bucket..."
curl -v -u "$COUCHBASE_USERNAME:$COUCHBASE_PASSWORD" -X POST http://127.0.0.1:8091/pools/default/buckets -d "name=$COUCHBASE_BUCKET_NAME" -d bucketType=couchbase -d ramQuotaMB=128 -d authType=sasl -d saslPassword=password
sleep 10

echo; echo "Couchbase setup completed. Proceed to configure collections (create.sh) and import data (populate.sh)."