#!/bin/sh

# Run docker-compose and starts mongo-express
set -a
. ./production.env
. ./development.env
set +a

cmd="docker-compose down"
echo "$cmd" && $cmd