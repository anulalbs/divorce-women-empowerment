import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
} from "../controllers/blogControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", authMiddleware, createBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
