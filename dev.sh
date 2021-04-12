#!/bin/sh

cmd="./environment.sh &"
echo "$cmd" && $cmd

cmd="./setup.sh &"
echo "$cmd" && $cmd

cmd="./database.sh &"
echo "$cmd" && $cmd

yarn run dev