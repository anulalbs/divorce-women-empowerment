import express from "express";
import Message from "../models/Message.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Fetch conversation between logged-in user and other user (paginated)
router.get("/:userId", authMiddleware, async (req, res) => {
  const me = new mongoose.Types.ObjectId(req.user._id);
  const them = new mongoose.Types.ObjectId(req.params.userId);
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "50");
  const skip = (page - 1) * limit;

  try {
    const messages = await Message.find({
      $or: [
        { sender: me, receiver: them },
        { sender: them, receiver: me },
      ],
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "fullname email")
      .populate("receiver", "fullname email");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Optional: send message via REST (also fine)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const msg = await Message.create({
      sender: req.user.id,
      receiver: req.body.receiver,
      message: req.body.message,
    });
    const populated = await msg.populate("sender", "fullname email").populate("receiver", "fullname email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
