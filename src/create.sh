docker run --rm \
    --network container:couchbase1 \
    couchbase /bin/sh -c '/opt/couchbase/bin/cbq -u Administrator -p password <<EOF
CREATE COLLECTION IF NOT EXISTS default._default.users;
CREATE COLLECTION IF NOT EXISTS default._default.categories;
CREATE COLLECTION IF NOT EXISTS default._default.locations;
CREATE COLLECTION IF NOT EXISTS default._default.events;
EOF'