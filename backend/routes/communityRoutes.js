import express from "express";
import CommunityPost from "../models/CommunityPost.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("author", "fullname email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
});

// Create new post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const newPost = new CommunityPost({
      title,
      content,
      tags,
      author: new mongoose.Types.ObjectId(req.user._id),
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: "Error creating post", error: err.message });
  }
});

// Like a post
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.likes += 1;
    await post.save();
    res.json({ message: "Post liked", likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Error liking post", error: err.message });
  }
});

export default router;
