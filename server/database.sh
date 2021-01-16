#!/bin/sh

docker run --name mongo \
  -e MONGO_INITDB_DATABASE=test \
  -p 27017:27017 \
  mongo
  