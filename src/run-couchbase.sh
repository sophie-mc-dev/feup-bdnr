#!/bin/bash
dir="./couchbase-setup"

cd $dir || exit

echo; echo "Running commands on server.sh"
./server.sh

sleep 5

echo; echo "Running commands on create.sh"
./create.sh

sleep 5

echo; echo "Running commands on populate.sh"
./populate.sh

sleep 5

echo; echo "Running creating of the search index"
./create-index.sh