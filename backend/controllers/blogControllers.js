import mongoose from "mongoose";
import Blog from "../models/Blog.js";

// Create new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user._id; // decoded from JWT middleware
    const blog = await Blog.create({
      title,
      content,
      tags,
      author: new mongoose.Types.ObjectId(userId),
    });
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all blogs (public)
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "fullname email")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id }).populate("author", "fullname");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ id: req.params.id, author: req.user.id });
    if (!blog) return res.status(404).json({ message: "Not found or not authorized" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
