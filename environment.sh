set -a
. ./production.env
. ./development.env
set +a

dev_network=$DOCKER_DEV_NETWORK
prod_network=$DOCKER_PROD_NETWORK

if [ "$(docker network inspect -f '{{.Id}}' $dev_network | wc -l)" -eq 2 ]; then
  echo "Docker network $dev_network already exists"
else
  echo "Creating docker network $dev_network"
  cmd="docker network create $dev_network"
  echo "$cmd" && $cmd
fi

if [ "$(docker network inspect -f '{{.Id}}' $prod_network | wc -l)" -eq 2 ]; then
  echo "Docker network $prod_network already exists"
else
  echo "Creating docker network $prod_network"
  cmd="docker network create $prod_network"
  echo "$cmd" && $cmd
fi