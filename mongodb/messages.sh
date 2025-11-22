#!/bin/bash

MONGO_CONTAINER="mongodb"
DB="empowerher_db"
COLLECTION="messages"
USER="admin"
PASS="secret"

read -r -d '' SCHEMA << 'EOF'
{
  collMod: "messages",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sender", "receiver", "message"],
      properties: {
        sender: { bsonType: "objectId" },
        receiver: { bsonType: "objectId" },
        message: { bsonType: "string" },
        isRead: { bsonType: "bool" }
      }
    }
  },
  validationLevel: "moderate"
}
EOF

echo "📨 Creating messages collection..."

docker exec -i $MONGO_CONTAINER mongosh -u $USER -p $PASS --authenticationDatabase admin <<EOF
use $DB;
db.createCollection("$COLLECTION");
db.runCommand($SCHEMA);
EOF

echo "✅ Messages collection ready!"
