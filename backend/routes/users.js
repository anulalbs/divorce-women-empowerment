import express from "express";
import { getExperts, getUsers, getMe, updateMe, changePassword, getRecentLogins } from "../controllers/userControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/experts", getExperts);
router.get("/recent-logins", getRecentLogins);

// auth protected profile endpoints
router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);
router.patch('/me/password', authMiddleware, changePassword);

export default router;
