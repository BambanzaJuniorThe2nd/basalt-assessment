#!/bin/bash

# Create a user-defined bridge network
docker network create my_network

# Check if the REDIS container is running
if docker ps -a --format '{{.Names}}' | grep -q '^redis_container$'; then
  # Container is running, stop and remove it
  echo "Stopping and removing existing redis_container..."
  docker stop redis_container
  docker rm redis_container
fi

# Check if the MongoDB container is running
if docker ps -a --format '{{.Names}}' | grep -q '^my-mongodb-container$'; then
  # Container is running, stop and remove it
  echo "Stopping and removing existing mongodb_container..."
  docker stop mongodb_container
  docker rm mongodb_container
fi

# Run the Redis container in detached mode
docker run -p 6379:6379 --network my_network --name redis_container -d redis/redis-stack-server:latest

# Wait for Redis container to fully start (adjust sleep time as needed)
sleep 5

# Run the MongoDB container and connect it to the custom bridge network
docker run -d --network my_network --name mongodb_container -p 27017:27017 mongodb/mongodb-community-server:6.0.9-ubi8

# Wait for MongoDB container to fully start (adjust sleep time as needed)
sleep 5

# Build server image
docker build --no-cache -t basalt_server .

# Run the basalt_server container with the dynamically obtained IP address
docker run --rm -it --network my_network -e REDIS_IP_ADDR=redis_container -e DB_URL=mongodb://mongodb_container:27017 -p 5000:5000/tcp basalt_server:latest