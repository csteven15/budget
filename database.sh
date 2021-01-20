#!/bin/sh

# Starts development MongoDB database
set -a
. ./production.env
. ./development.env
set +a

container_name=$MONGO_DEV_CONTAINER

if [ $( docker ps -a -f name=$container_name | wc -l ) -eq 2 ]; then
  echo "Container $container_name exists. Restarting..."
  docker stop $container_name
  docker container start $container_name
else
  docker run --name $container_name \
    -e MONGO_INITDB_DATABASE=$MONGO_DEV_CONTAINER_INITDB \
    --network $DOCKER_PROD_NETWORK \
    -p 27017:$MONGO_DEV_CONTAINER_PORT \
    mongo
fi