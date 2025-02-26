#!/bin/bash
# ScancerAI Docker Deployment Script

# Set variables
IMAGE_NAME="scancerai"
IMAGE_TAG="latest"
CONTAINER_NAME="scancerai-app"
PORT=3000

# Print header
echo "====================================="
echo "ScancerAI Docker Deployment Assistant"
echo "====================================="
echo

# Build the Docker image
echo "🔨 Building Docker image: $IMAGE_NAME:$IMAGE_TAG"
docker build -t $IMAGE_NAME:$IMAGE_TAG .

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Docker build failed!"
  exit 1
fi

echo "✅ Docker image built successfully!"
echo

# Check if the container is already running
RUNNING=$(docker ps -q -f name=$CONTAINER_NAME)
if [ -n "$RUNNING" ]; then
  echo "🔄 Stopping existing container: $CONTAINER_NAME"
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
fi

# Run the Docker container
echo "🚀 Starting container: $CONTAINER_NAME"
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:3000 \
  -e NODE_ENV=production \
  $IMAGE_NAME:$IMAGE_TAG

# Check if container started successfully
if [ $? -ne 0 ]; then
  echo "❌ Failed to start container!"
  exit 1
fi

echo "✅ Container started successfully!"
echo
echo "ScancerAI is now running at http://localhost:$PORT"
echo
echo "📋 Container logs:"
docker logs $CONTAINER_NAME
echo
echo "To stop the container, run: docker stop $CONTAINER_NAME"
echo "=====================================" 