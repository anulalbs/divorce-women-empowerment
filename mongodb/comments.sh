#!/bin/bash
MONGO_CONTAINER_NAME="mongodb"
MONGO_USER="admin"
MONGO_PASS="secret"
MONGO_DB="empowerher_db"
MONGO_COLLECTION="comments"

if ! docker ps | grep -q $MONGO_CONTAINER_NAME; then
  echo "❌ MongoDB container '$MONGO_CONTAINER_NAME' not running."
  exit 1
fi

read -r -d '' MONGO_SCHEMA <<'EOF'
{
  collMod: "comments",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["post", "author", "content", "createdAt"],
      properties: {
        post: { bsonType: "objectId", description: "Associated post" },
        author: { bsonType: "objectId", description: "Comment author" },
        content: { bsonType: "string", description: "Comment text" },
        parentComment: { bsonType: ["objectId", "null"], description: "Parent comment" },
        likes: {
          bsonType: ["array"],
          items: { bsonType: "objectId" },
          description: "Users who liked this comment"
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate"
}
EOF

docker exec -i $MONGO_CONTAINER_NAME mongosh -u $MONGO_USER -p $MONGO_PASS --authenticationDatabase admin <<EOF
use $MONGO_DB;
db.createCollection("$MONGO_COLLECTION");
db.runCommand($MONGO_SCHEMA);
db.$MONGO_COLLECTION.createIndex({ post: 1 });
db.$MONGO_COLLECTION.createIndex({ parentComment: 1 });
EOF

echo "✅ Comments collection with likes & replies created successfully!"
