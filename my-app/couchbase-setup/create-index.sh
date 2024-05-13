#!/bin/bash

source .env

# Step 8: Create search index for 'events' collection
echo; echo "Step 7: Creating search index for 'events' collection..."

curl -XPUT -H "Content-Type: application/json" -u "$COUCHBASE_USERNAME:$COUCHBASE_PASSWORD" \
http://localhost:8094/api/bucket/"$COUCHBASE_BUCKET_NAME"/scope/_default/index/eventSearch -d \
'{
  "type": "fulltext-index",
  "name": "event_shop._default.eventSearch",
  "sourceType": "gocbcore",
  "sourceName": "event_shop",
  "planParams": {
    "maxPartitionsPerPIndex": 1024,
    "indexPartitions": 1
  },
  "params": {
    "doc_config": {
      "docid_prefix_delim": "",
      "docid_regexp": "",
      "mode": "scope.collection.type_field",
      "type_field": "type"
    },
    "mapping": {
      "analysis": {
        "analyzers": {
          "stemmer": {
            "token_filters": [
              "stemmer_en_plural",
              "stemmer_en_snowball"
            ],
            "tokenizer": "unicode",
            "type": "custom"
          }
        }
      },
      "default_analyzer": "standard",
      "default_datetime_parser": "dateTimeOptional",
      "default_field": "_all",
      "default_mapping": {
        "dynamic": false,
        "enabled": false
      },
      "default_type": "_default",
      "docvalues_dynamic": false,
      "index_dynamic": false,
      "store_dynamic": false,
      "type_field": "_type",
      "types": {
        "_default.events": {
          "dynamic": false,
          "enabled": true,
          "properties": {
            "artists": {
              "dynamic": false,
              "enabled": true,
              "fields": [
                {
                  "analyzer": "standard",
                  "include_in_all": true,
                  "include_term_vectors": true,
                  "index": true,
                  "name": "artists",
                  "store": true,
                  "type": "text"
                }
              ]
            },
            "description": {
              "dynamic": false,
              "enabled": true,
              "fields": [
                {
                  "analyzer": "en",
                  "include_in_all": true,
                  "include_term_vectors": true,
                  "index": true,
                  "name": "description",
                  "store": true,
                  "type": "text"
                }
              ]
            },
            "event_name": {
              "dynamic": false,
              "enabled": true,
              "fields": [
                {
                  "analyzer": "simple",
                  "docvalues": true,
                  "include_in_all": true,
                  "include_term_vectors": true,
                  "index": true,
                  "name": "event_name",
                  "store": true,
                  "type": "text"
                }
              ]
            }
          }
        }
      }
    },
    "store": {
      "indexType": "scorch",
      "segmentVersion": 15
    }
  },
  "sourceParams": {}
}'


# Step 9: Create secondary indexes
echo; echo "Step 8: Creating index for 'users' collection"
docker exec -it "$CONTAINER_NAME" bash -c 'cbq -e http://localhost:8091 -u Administrator -p password -q=true -s="CREATE INDEX idx_event_comments ON event_shop._default.users((ALL ARRAY c.event_id FOR c IN comments END));"'
docker exec -it "$CONTAINER_NAME" bash -c 'cbq -e http://localhost:8091 -u Administrator -p password -q=true -s="CREATE INDEX idx_user_info ON event_shop._default.users(user_id, username, email);"'

# Step 10: Create index for 'events' collection
echo; echo "Step 9: Creating index for 'events' collection"
docker exec -it "$CONTAINER_NAME" bash -c 'cbq -e http://localhost:8091 -u Administrator -p password -q=true -s="CREATE INDEX idx_event_info ON event_shop._default.events(event_id, location, STR_TO_MILLIS(date), organization_id);"'

# Step 11: Create index for 'transactions' collection
echo; echo "Step 10: Creating index for 'transactions' collection"
docker exec -it "$CONTAINER_NAME" bash -c 'cbq -e http://localhost:8091 -u Administrator -p password -q=true -s="CREATE INDEX idx_transaction_info ON event_shop._default.transactions((ALL ARRAY STR_TO_MILLIS(i.event_date) FOR i IN items END), user_id, transaction_status);"'