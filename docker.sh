#!/bin/sh

# Run docker-compose and starts mongo-express

cmd="docker-compose up --build --force-recreate --no-deps"
echo "$cmd" && $cmd

echo "Starting Mongo Express"
cmd="./mongo-express.sh"
echo "$cmd" && $cmd