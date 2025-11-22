import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as IOServer } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/users.js";
import blogRoutes from "./routes/blogRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import initSocket from "./socket.js";
import User from "./models/User.js";
import Message from "./models/Message.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);


const httpServer = http.createServer(app);
// Allow origins for Socket.IO: use CLIENT_ORIGIN if set, and also allow Vite dev server at 5173
const allowedOrigins = [];
if (process.env.CLIENT_ORIGIN) allowedOrigins.push(process.env.CLIENT_ORIGIN);
// ensure vite dev origin allowed during development
if (!allowedOrigins.includes("http://localhost:5173")) allowedOrigins.push("http://localhost:5173");
// fallback default (3000) if nothing provided
if (allowedOrigins.length === 0) allowedOrigins.push("http://localhost:3000");

const io = new IOServer(httpServer, {
  cors: {
     origin: allowedOrigins,
    credentials: true,
  },
});

// initialize socket handlers
initSocket(io, { User, Message });

const PORT = process.env.PORT || 5000;
// Start the HTTP server (attach Socket.IO to the same server)
httpServer.listen(PORT, () => console.log(`Server (httpServer) running on port ${PORT}`));
