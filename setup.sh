#!/bin/sh

# Sets up node modules, starts development database, and mongo-express

if [ -d "node-modules" ]; then
  echo "Node modules already installed"
else
  echo "Installing Node modules..."
  cmd=yarn install && cd client && yarn install && cd ../server && yarn install
  echo "$cmd" && $cmd
fi

cmd="./database.sh"
echo "$cmd" && $cmd

cmd="./mongo-express.sh dev"
echo "$cmd" && $cmd