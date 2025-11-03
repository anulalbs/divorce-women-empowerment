#!/bin/bash
# ==========================================================
# MongoDB Collection Creation Script
# Creates a 'blogs' collection with schema validation
# ==========================================================

# --- Configuration ---
MONGO_CONTAINER_NAME="mongodb"
MONGO_USER="admin"
MONGO_PASS="secret"
MONGO_DB="empowerher_db"
MONGO_COLLECTION="blogs"

# --- Check Mongo Container ---
if ! docker ps | grep -q $MONGO_CONTAINER_NAME; then
  echo "❌ MongoDB container '$MONGO_CONTAINER_NAME' is not running."
  echo "➡️  Start it first using: docker start $MONGO_CONTAINER_NAME"
  exit 1
fi

# --- MongoDB Schema (as JSON) ---
read -r -d '' MONGO_SCHEMA <<'EOF'
{
  collMod: "blogs",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "content", "author"],
      properties: {
        title: {
          bsonType: "string",
          description: "Blog title"
        },
        content: {
          bsonType: "string",
          description: "Blog content text"
        },
        author: {
          bsonType: "objectId",
          description: "Reference to User collection"
        },
        tags: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "List of tags"
        },
        isPublished: {
          bsonType: "bool",
          description: "Publication status"
        },
        createdAt: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  },
  validationLevel: "moderate"
}
EOF

# --- Create DB and Collection ---
echo "🚀 Creating MongoDB collection '$MONGO_COLLECTION' in database '$MONGO_DB'..."

docker exec -i $MONGO_CONTAINER_NAME mongosh -u $MONGO_USER -p $MONGO_PASS --authenticationDatabase admin <<EOF
use $MONGO_DB;
db.createCollection("$MONGO_COLLECTION");
db.runCommand($MONGO_SCHEMA);

# Create indexes
db.$MONGO_COLLECTION.createIndex({ title: 1 });
db.$MONGO_COLLECTION.createIndex({ author: 1 });
EOF

if [ $? -eq 0 ]; then
  echo "✅ Collection '$MONGO_COLLECTION' created successfully with schema validation and indexes!"
else
  echo "❌ Failed to create collection '$MONGO_COLLECTION'."
fi
