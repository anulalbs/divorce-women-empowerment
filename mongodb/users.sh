#!/bin/bash
# ==========================================================
# MongoDB Collection Creation Script
# Creates a 'users' collection with schema validation
# ==========================================================

# --- Configuration ---
MONGO_CONTAINER_NAME="mongodb"
MONGO_USER="admin"
MONGO_PASS="secret"
MONGO_DB="empowerher_db"
MONGO_COLLECTION="users"

# --- Check Mongo Container ---
if ! docker ps | grep -q $MONGO_CONTAINER_NAME; then
  echo "❌ MongoDB container '$MONGO_CONTAINER_NAME' is not running."
  echo "➡️  Start it first using: docker start $MONGO_CONTAINER_NAME"
  exit 1
fi

# --- MongoDB Schema (as JSON) ---
read -r -d '' MONGO_SCHEMA <<'EOF'
{
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "fullname", "email", "password", "role", "isActive", "createdDate", "updatedDate"],
      properties: {
        id: {
          bsonType: "string",
          description: "Unique user ID"
        },
        fullname: {
          bsonType: "string",
          description: "User full name"
        },
        email: {
          bsonType: "string",
          description: "User email address"
        },
        phone: {
          bsonType: ["string", "null"],
          description: "User phone number"
        },
        location: {
          bsonType: ["string", "null"],
          description: "User location"
        },
        password: {
          bsonType: "string",
          description: "User password hash"
        },
        role: {
          enum: ["admin", "user", "manager", "guest"],
          description: "User role"
        },
        isActive: {
          bsonType: "bool",
          description: "Active status"
        },
        createdDate: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updatedDate: {
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
EOF

if [ $? -eq 0 ]; then
  echo "✅ Collection '$MONGO_COLLECTION' created successfully with schema validation!"
else
  echo "❌ Failed to create collection '$MONGO_COLLECTION'."
fi
