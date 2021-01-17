#!/bin/sh

# Starts mongo-express

if [ "$#" -eq 0 ]; then
  environment="Production"
  container_name="mongo"
  port=27018
else
  environment="Development"
  container_name="mongo-dev"
  port=27017
fi

echo "Environment: $environment"

if [ $( docker ps -a -f name=$container_name | wc -l ) -eq 2 ]; then
  echo "Container $container_name exists. Restarting..."
  docker stop $container_name || true
  docker container start $container_name
else
  echo "Creating container $container_name"
  docker run --name $container_name \
    --network budget \
    -e ME_CONFIG_MONGODB_SERVER=budget \
    -e ME_CONFIG_BASICAUTH_USERNAME=budget \
    -e ME_CONFIG_BASICAUTH_PASSWORD=pass \
    -e ME_CONFIG_MONGODB_PORT=$port \
    -p 8081:8081 mongo-express
fi