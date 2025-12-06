// Switch to your database
use("test");

// Create the collection with validator
db.createCollection("reports", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["expertId", "userId", "comment", "status"],
      properties: {
        expertId: {
          bsonType: "objectId",
          description: "Expert user ID",
        },
        userId: {
          bsonType: "objectId",
          description: "User ID who raised report",
        },
        comment: {
          bsonType: "string",
          description: "Comment text",
        },
        status: {
          bsonType: "string",
          enum: ["open", "in-progress", "closed", "resolved"],
          description: "Report status",
        }
      }
    }
  }
});

print("✔️ reports collection created with validation");
