#!/bin/bash

# Step 1: Pull Couchbase image
echo "Step 1: Pulling Couchbase image..."
docker pull couchbase

# Step 2: Build Docker image
echo "Step 2: Building Docker image..."
docker build -t bdnr ./couchbase-custom

# Step 3: Run Docker container
echo "Step 3: Running Docker container..."
docker run -d -p 8091-8093:8091-8093 \
    -e COUCHBASE_ADMINISTRATOR_USERNAME=Administrator \
    -e COUCHBASE_ADMINISTRATOR_PASSWORD=password \
    -e COUCHBASE_BUCKET=default \
    -e COUCHBASE_BUCKET_PASSWORD= \
    --network="bridge" \
    --name couchbase1 \
    bdnr

# Step 4: Display Docker logs
echo "Step 4: Displaying Docker logs..."
docker logs -f couchbase1
