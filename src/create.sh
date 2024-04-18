#!/bin/bash

source .env

docker run --rm \
    --network container:"$CONTAINER_NAME" \
    "$COUCHBASE_IMAGE" /bin/sh -c '/opt/couchbase/bin/couchbase-cli bucket-create -c localhost:8091 \
    -u Administrator -p password --bucket event_shop --bucket-type couchbase \
    --bucket-ramsize 100 --bucket-replica 1 \
    --wait'


docker run --rm \
    --network container:"$CONTAINER_NAME" \
    "$COUCHBASE_IMAGE" /bin/sh -c '/opt/couchbase/bin/cbq -u Administrator -p password <<EOF
CREATE COLLECTION IF NOT EXISTS event_shop._default.users;
CREATE COLLECTION IF NOT EXISTS event_shop._default.categories;
CREATE COLLECTION IF NOT EXISTS event_shop._default.locations;
CREATE COLLECTION IF NOT EXISTS event_shop._default.events;
CREATE COLLECTION IF NOT EXISTS event_shop._default.artists;
CREATE COLLECTION IF NOT EXISTS event_shop._default.transactions;
EOF'
