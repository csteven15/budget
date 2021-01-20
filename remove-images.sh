#!/bin/sh

# Removes all images

cmd="docker rm -f $(docker ps -a -q)"
echo "$cmd" && eval "$cmd"

cmd="docker rmi -f $(docker images -q)"
echo "$cmd" && eval "$cmd"
