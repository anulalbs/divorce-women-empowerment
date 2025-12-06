import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
