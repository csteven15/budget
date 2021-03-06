#!/bin/sh

set -a
. ./development.env
set +a

cmd="./database.sh &"
echo "$cmd" && $cmd

yarn run lint

yarn run dev