#!/bin/sh

# Starts development MongoDB database

container_name="mongo-dev"

if [ $( docker ps -a -f name=$container_name | wc -l ) -eq 2 ]; then
  echo "Container $container_name exists. Restarting..."
  docker stop $container_name
  docker container start $container_name
else
  docker run --name $container_name \
    -e MONGO_INITDB_DATABASE=test \
    --network budget \
    -p 27017:27017 \
    mongo
fi