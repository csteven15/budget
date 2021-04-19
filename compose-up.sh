#!/bin/sh

set -a
. ./production.env
. ./development.env
set +a

dev_network=$DOCKER_DEV_NETWORK
prod_network=$DOCKER_PROD_NETWORK

cmd="docker-compose up -d"
echo "$cmd" && $cmd
