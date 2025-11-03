#!/bin/bash
# ==========================================================
# MongoDB Collection Creation Script
# Creates a 'communityposts' collection with schema validation
# ==========================================================

MONGO_CONTAINER_NAME="mongodb"
MONGO_USER="admin"
MONGO_PASS="secret"
MONGO_DB="empowerher_db"
MONGO_COLLECTION="communityposts"

if ! docker ps | grep -q $MONGO_CONTAINER_NAME; then
  echo "❌ MongoDB container '$MONGO_CONTAINER_NAME' is not running."
  exit 1
fi

read -r -d '' MONGO_SCHEMA <<'EOF'
{
  collMod: "communityposts",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "content", "author"],
      properties: {
        title: { bsonType: "string", description: "Post title" },
        content: { bsonType: "string", description: "Post content" },
        author: { bsonType: "objectId", description: "Reference to user" },
        likes: { bsonType: "int", description: "Like count" },
        tags: { bsonType: ["array"], items: { bsonType: "string" } },
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: ["date", "null"] },
        updatedAt: { bsonType: ["date", "null"] }
      }
    }
  },
  validationLevel: "moderate"
}
EOF

docker exec -i $MONGO_CONTAINER_NAME mongosh -u $MONGO_USER -p $MONGO_PASS --authenticationDatabase admin <<EOF
use $MONGO_DB;
if (!db.getCollectionNames().includes("$MONGO_COLLECTION")) {
  db.createCollection("$MONGO_COLLECTION");
}
db.runCommand($MONGO_SCHEMA);
db.$MONGO_COLLECTION.createIndex({ title: 1 });
db.$MONGO_COLLECTION.createIndex({ author: 1 });
EOF

if [ $? -eq 0 ]; then
  echo "✅ Collection '$MONGO_COLLECTION' created with schema and indexes!"
else
  echo "❌ Failed to create '$MONGO_COLLECTION'."
fi
