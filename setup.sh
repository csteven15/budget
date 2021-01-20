#!/bin/sh

# Sets up node modules, starts development database, and mongo-express

set -a
. ./production.env
. ./development.env
set +a

pwd=$(pwd)

if [ -d "node-modules" ]; then
  echo "Node modules already installed"
else
  echo "Installing Node modules..."

  cmd="yarn install"
  echo "$cmd" && $cmd
  cmd="cd $pwd/client"
  echo "$cmd" && $cmd
  cmd="yarn install"
  echo "$cmd" && $cmd
  cmd="cd $pwd/server"
  echo "$cmd" && $cmd
  cmd="yarn install"
  echo "$cmd" && $cmd
fi

cmd="cd $pwd"
echo "$cmd" && $cmd

dev_network=$DOCKER_DEV_NETWORK
prod_network=$DOCKER_PROD_NETWORK

if [ "$(docker network inspect -f '{{.Id}}' $dev_network | wc -l)" -eq 2 ]; then
  echo "Docker network $dev_network already exists"
else
  echo "Creating docker network $dev_network"
  cmd="docker network create $dev_network"
  echo "$cmd" && $cmd
fi

if [ "$(docker network inspect -f '{{.Id}}' $prod_network | wc -l)" -eq 2 ]; then
  echo "Docker network $prod_network already exists"
else
  echo "Creating docker network $prod_network"
  cmd="docker network create $prod_network"
  echo "$cmd" && $cmd
fi

cmd="./database.sh &"
echo "$cmd" && $cmd

cmd="./mongo-express.sh dev &"
echo "$cmd" && $cmd