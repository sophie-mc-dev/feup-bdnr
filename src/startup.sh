#!/bin/bash

backend_dir="backend"
frontend_dir="frontend"
couchbase_dir="./couchbase-setup"

cd $couchbase_dir || exit

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

sleep 5

cd ..

# BACKEND
cd $backend_dir || exit

docker build -t couchbase/backend .
docker run -d -p 3000:3000 --name couchbase-backend couchbase/backend

cd ../..

# FRONTEND
cd $frontend_dir || exit

docker build -t couchbase/frontend .
docker run -d -p 8080:8080 --name couchbase-frontend couchbase/frontend