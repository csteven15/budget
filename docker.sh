#!/bin/sh

# Run docker-compose and starts mongo-express
set -a
. ./production.env
. ./development.env
set +a

cmd="docker-compose up --build --force-recreate --no-deps"
echo "$cmd" && $cmd

echo "Starting Mongo Express"

cmd="./mongo-express.sh &"
echo "$cmd" && $cmd
