#!/bin/sh

# Removes all images
set -a
. ./production.env
. ./development.env
set +a

cmd="docker rmi -f $(docker ps -a -q)"
echo "$cmd" && $cmd

cmd="docker rmi -f $(docker images -q)"
echo "$cmd" && $cmd

cmd="docker network rm $DOCKER_DEV_NETWORK"
echo "$cmd" && $cmd

cmd="docker network rm ${DOCKER_PROD_NETWORK}"
echo "$cmd" && $cmd
