import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // ✅ Generate unique ID if not provided
      unique: true,
      required: true,
      description: "Unique user ID",
    },
    fullname: {
      type: String,
      required: true,
      description: "User full name",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      description: "User email address",
    },
    phone: {
      type: String,
      default: null,
      description: "User phone number",
    },
    location: {
      type: String,
      default: null,
      description: "User location",
    },
    password: {
      type: String,
      required: true,
      description: "User password hash",
    },
    role: {
      type: String,
      enum: ["admin", "user", "lawyer", "mentor"],
      required: true,
      default: "user",
      description: "User role",
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      description: "Active status",
    },
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
      description: "Creation timestamp",
    },
    updatedDate: {
      type: Date,
      required: true,
      default: Date.now,
      description: "Last update timestamp",
    },
  },
  {
    collection: "users",
  }
);

// ✅ Automatically update updatedDate on save
userSchema.pre("save", function (next) {
  this.updatedDate = new Date();
  next();
});

export default mongoose.model("User", userSchema);

