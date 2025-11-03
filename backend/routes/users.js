import express from "express";
import { getExperts, getUsers } from "../controllers/userControllers.js";


const router = express.Router();

router.get("/", getUsers);
router.get("/experts", getExperts);

export default router;
