#!/bin/sh

# Starts mongo-express

if [ "$#" -eq 0 ]; then
  environment="Production"
  db_container_name="mongo"
  container_name="mongo-express"
  port=27018
else
  environment="Development"
  db_container_name="mongo-dev"
  container_name="mongo-express-dev"
  port=27017
fi

echo "Environment: $environment"

if [ $( docker ps -a -f name=$container_name | wc -l ) -eq 2 ]; then
  echo "Container $container_name exists. Restarting..."
  docker stop $container_name || true
  docker container start $db_container_name
else
  echo "Creating container $container_name"
  docker run --name $container_name \
    --network budget \
    -e ME_CONFIG_MONGODB_SERVER=$db_container_name \
    -e ME_CONFIG_BASICAUTH_USERNAME=budget \
    -e ME_CONFIG_BASICAUTH_PASSWORD=pass \
    -e ME_CONFIG_MONGODB_PORT=$port \
    -p 8081:8081 mongo-express
fi