#!/bin/sh

# Sets up node modules, starts development database, and mongo-express

if [ -d "node-modules" ]; then
  echo "Node modules already installed"
else
  echo "Installing Node modules..."
  cmd="yarn install"
  echo "$cmd" && eval "$cmd"
  cmd="cd client && ls && yarn install && cd .."
  echo "$cmd" && eval "$cmd"
  cmd="cd server && yarn install && cd .."
  echo "$cmd" && eval "$cmd"
fi

docker network create budget

cmd="./database.sh &"
echo "$cmd" && eval "$cmd"

cmd="./mongo-express.sh dev &"
echo "$cmd" && eval "$cmd"