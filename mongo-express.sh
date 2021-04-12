#!/bin/sh

# Starts mongo-express
set -a
. ./production.env
. ./development.env
set +a

if [ "$#" -eq 0 ]; then
  environment="Production"
  db_container_name=$MONGO_PROD_CONTAINER
  container_name=$MONGO_EXPRESS_PROD_CONTAINER
  port=$MONGO_PROD_CONTAINER_PORT
  bind_port=$MONGO_EXPRESS_PROD_CONTAINER_BIND_PORT
  network=$DOCKER_PROD_NETWORK
else
  environment="Development"
  db_container_name=$MONGO_DEV_CONTAINER
  container_name=$MONGO_EXPRESS_DEV_CONTAINER
  port=$MONGO_DEV_CONTAINER_PORT
  bind_port=$MONGO_EXPRESS_DEV_CONTAINER_BIND_PORT
  network=$DOCKER_DEV_NETWORK
fi

echo "Environment: $environment"

if [ "$(docker ps -a -f name=$container_name | wc -l)" -eq 2 ]; then
  echo "Container $container_name exists. Restarting..."
  docker container stop $container_name || true
  docker container start $db_container_name
else
  echo "Creating container $container_name"
  docker run -d --name $container_name \
    --network $network \
    -e ME_CONFIG_MONGODB_SERVER=$db_container_name \
    -e ME_CONFIG_BASICAUTH_USERNAME=$MONGODB_USERNAME \
    -e ME_CONFIG_BASICAUTH_PASSWORD=$MONGODB_PASSWORD \
    -e ME_CONFIG_MONGODB_PORT=$port \
    -p 8081:$bind_port mongo-express
fi