import jwt from "jsonwebtoken";

export default function initSocket(io, { User, Message }) {
  // Middleware to authenticate socket with JWT sent in auth payload
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("[socket] handshake missing token", { id: socket.id, handshake: socket.handshake });
      return next(new Error("Authentication error: token required"));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: payload.id }; // attach user id
      console.log("[socket] handshake verified", { socketId: socket.id, userId: payload.id });
      return next();
    } catch (err) {
      console.log("[socket] handshake jwt verify failed", err.message);
      return next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const uid = socket.user.id;
    console.log(`[socket] connected socketId=${socket.id} uid=${uid}`);
    // join a room for this user so others can emit to them directly
    socket.join(uid);
    console.log(`[socket] joined room for uid=${uid}`);

    // Mark user online (optional: update DB or in-memory map)
    io.emit("presence:update", { userId: uid, status: "online" });

    // receive private message and persist then forward
    socket.on("private:send", async ({ to, message }) => {
      console.log(`[socket] private:send received from=${uid} to=${to} messageLen=${message?.length || 0}`);
      try {
        // persist message
        const msgDoc = await Message.create({
          sender: uid,
          receiver: to,
          message,
          isRead: false,
        });

        // populate sender/receiver for client
        // msgDoc.populate(...) on a created document may not support chaining in all Mongoose versions.
        // Retrieve the saved doc with populate via a query to ensure populated fields are returned.
        const populated = await Message.findById(msgDoc._id)
          .populate("sender", "fullname email")
          .populate("receiver", "fullname email");

        console.log(`[socket] private:send persisted id=${populated._id}`);
        // send to receiver room and back to sender
        io.to(to).emit("private:receive", populated);
        io.to(uid).emit("private:receive", populated);
        console.log(`[socket] private:receive emitted to to=${to} and uid=${uid}`);

      } catch (err) {
        console.error('[socket] private:send error', err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // typing indicator
    socket.on("private:typing", ({ to, isTyping }) => {
      console.log(`[socket] private:typing from=${uid} to=${to} isTyping=${isTyping}`);
      io.to(to).emit("private:typing", { from: uid, isTyping });
    });

    // mark messages read (optional)
    socket.on("private:read", async ({ from }) => {
      console.log(`[socket] private:read from=${from} by=${uid}`);
      await Message.updateMany({ sender: from, receiver: uid, isRead: false }, { $set: { isRead: true } });
      io.to(from).emit("private:read_ack", { by: uid });
    });

    socket.on("disconnect", (reason) => {
      console.log(`[socket] disconnect socketId=${socket.id} uid=${uid} reason=${reason}`);
      io.emit("presence:update", { userId: uid, status: "offline" });
    });
  });
}
