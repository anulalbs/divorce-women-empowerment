#!/bin/bash
# ==========================================================
# MongoDB + Mongo Express Docker Setup Script
# Author: ChatGPT
# ==========================================================

# --- Configuration ---
MONGO_CONTAINER_NAME="mongodb"
MONGO_EXPRESS_CONTAINER_NAME="mongo-express"
MONGO_PORT=27017
MONGO_EXPRESS_PORT=8081
MONGO_USER="admin"
MONGO_PASS="secret"
MONGO_IMAGE="mongo:latest"
MONGO_EXPRESS_IMAGE="mongo-express:latest"
MONGO_VOLUME="mongo_data"

# --- Helper Function ---
check_container() {
  if [ "$(docker ps -aq -f name=$1)" ]; then
    echo "🛑 Container '$1' already exists. Removing it..."
    docker rm -f $1 >/dev/null 2>&1
  fi
}

# --- Start MongoDB ---
echo "🚀 Starting MongoDB container..."
check_container $MONGO_CONTAINER_NAME

docker run -d \
  --name $MONGO_CONTAINER_NAME \
  -p $MONGO_PORT:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=$MONGO_USER \
  -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASS \
  -v $MONGO_VOLUME:/data/db \
  $MONGO_IMAGE

if [ $? -ne 0 ]; then
  echo "❌ Failed to start MongoDB container!"
  exit 1
fi

# --- Start Mongo Express ---
read -p "Do you want to start Mongo Express (web UI)? [y/N]: " start_express

if [[ "$start_express" =~ ^[Yy]$ ]]; then
  echo "🌐 Starting Mongo Express container..."
  check_container $MONGO_EXPRESS_CONTAINER_NAME

  docker run -d \
    --name $MONGO_EXPRESS_CONTAINER_NAME \
    -p $MONGO_EXPRESS_PORT:8081 \
    -e ME_CONFIG_MONGODB_ADMINUSERNAME=$MONGO_USER \
    -e ME_CONFIG_MONGODB_ADMINPASSWORD=$MONGO_PASS \
    -e ME_CONFIG_MONGODB_SERVER=$MONGO_CONTAINER_NAME \
    --link $MONGO_CONTAINER_NAME:mongo \
    $MONGO_EXPRESS_IMAGE

  if [ $? -eq 0 ]; then
    echo "✅ Mongo Express is running at: http://localhost:$MONGO_EXPRESS_PORT"
  else
    echo "⚠️ Failed to start Mongo Express!"
  fi
fi

echo ""
echo "✅ MongoDB is running successfully!"
echo "📦 Container: $MONGO_CONTAINER_NAME"
echo "🔗 Connection URI: mongodb://$MONGO_USER:$MONGO_PASS@localhost:$MONGO_PORT/"
echo "💾 Data volume: $MONGO_VOLUME"
echo ""
