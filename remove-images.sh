#!/bin/sh

# Removes all images

cmd="docker rm -f $(docker ps -a -q)"
echo "$cmd" && $cmd

cmd="docker rmi -f $(docker images -q)"
echo "$cmd" && $cmd
