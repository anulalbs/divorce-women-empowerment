import express from "express";
import Comment from "../models/Comment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Recursive fetch
const getNestedComments = async (postId, parentComment = null) => {
  const comments = await Comment.find({ post: postId, parentComment })
    .populate("author", "fullname email")
    .lean();

  const results = [];
  for (const c of comments) {
    const replies = await getNestedComments(postId, c._id);
    const replyCount = replies.length;
    results.push({
      ...c,
      replies,
      replyCount,
      likeCount: c.likes?.length || 0,
    });
  }
  return results;
};

// Get all nested comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const data = await getNestedComments(req.params.postId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
});

// Add new comment/reply
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { post, content, parentComment = null } = req.body;
    const comment = await Comment.create({
      post,
      content,
      parentComment,
      author: new mongoose.Types.ObjectId(req.user._id),
    });
    res.status(201).json(await comment.populate("author", "fullname email"));
  } catch (err) {
    res.status(400).json({ message: "Error adding comment", error: err.message });
  }
});

// Toggle like
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user._id;
    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.json({ message: "Like toggled", likeCount: comment.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", error: err.message });
  }
});

export default router;
