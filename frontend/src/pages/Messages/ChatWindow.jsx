import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../api/axiosClient";
import { connectSocket } from "../../utils/socket";

export default function ChatWindow({ otherUser }) {
  const {profile:user} = useSelector((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const socketRef = useRef(null);
  const scrollRef = useRef();
  const userId = user?._id || user?.id;
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  // clear conversation when otherUser changes
  useEffect(() => {
    setMessages([]);
    setTypingUsers({});
  }, [otherUser?._id]);

  useEffect(() => {
  if (!userId) return;

  // connect socket with token (pass JWT stored in localStorage)
  const token = localStorage.getItem("token");
  const socket = connectSocket(token);
  setConnectionStatus("connecting");
    socketRef.current = socket;
    // if socket is already connected, update status immediately
    if (socket?.connected) {
      setConnectionStatus("connected");
    }

    // connection life-cycle events
    const handleConnect = () => {
      console.log("[socket] client connected", socket.id);
      setConnectionStatus("connected");
    };
    const handleConnectError = (err) => {
      console.error("[socket] connect_error", err?.message || err);
      // if auth failed the server will reject handshake with error
      setConnectionStatus("auth_failed");
    };
    const handleDisconnect = (reason) => {
      console.log("[socket] client disconnect", reason);
      setConnectionStatus("disconnected");
    };
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    // load existing conversation via REST
    let mounted = true;
    const load = async () => {
      if (!otherUser?._id) return;
      try {
        const res = await axiosClient.get(`/messages/${otherUser._id}`);
        // guard: only update state if component still mounted
        if (!mounted) return;
        const msgs = Array.isArray(res.data)
          ? res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          : [];
        setMessages(msgs);
        // Optionally mark unread as read via API here
      } catch (err) {
        console.error("Failed to load conversation", err);
      }
    };
    load();

    // receive incoming messages — DEBUG: always append and print full msg
    const handleReceive = (msg) => {
      // also log id shapes used for matching
      try {
        console.log("debug ids -> sender._id:", msg.sender?._id, "receiver._id:", msg.receiver?._id, "userId:", userId, "otherUser._id:", otherUser?._id);
      } catch (e) {
        console.warn("failed to log ids", e);
      }
      // Normalize id shapes (could be populated objects or plain ids)
      const senderId = msg.sender?._id || msg.sender;
      const receiverId = msg.receiver?._id || msg.receiver;
      const sid = String(senderId);
      const rid = String(receiverId);
      const uid = String(userId);
      const ouid = String(otherUser?._id);
      const isForThisConversation = (sid === ouid && rid === uid) || (sid === uid && rid === ouid);

      if (isForThisConversation) {
        setMessages((m) => [...m, msg]);
      } else {
        // Ignore messages not for the active conversation (could show notifications elsewhere)
        console.log("private:receive - not for active conversation, ignoring");
      }
    };
    socket.on("private:receive", handleReceive);

    // typing indicator
    const handleTyping = ({ from, isTyping }) => {
      setTypingUsers((prev) => ({ ...prev, [from]: isTyping }));
    };
    socket.on("private:typing", handleTyping);

    // presence updates (optional)
    const handlePresence = (p) => {
      // use p.userId, p.status to show online/offline
      // you can store globally or in parent component
    };
    socket.on("presence:update", handlePresence);

    return () => {
      mounted = false;
  socket.off("private:receive", handleReceive);
  socket.off("private:typing", handleTyping);
  socket.off("presence:update", handlePresence);
  socket.off("connect", handleConnect);
  socket.off("connect_error", handleConnectError);
  socket.off("disconnect", handleDisconnect);
      // do not disconnect socket here if shared globally; if per user, disconnect
      // disconnectSocket();
    };
  }, [user, otherUser?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    // Emit over socket (will be persisted by server)
    if (!socketRef.current) {
      console.warn("Socket not connected yet");
      return;
    }
    socketRef.current.emit("private:send", {
      to: otherUser._id,
      message: text.trim(),
    });
    setText("");
  };

  // typing emitter (debounced)
  let typingTimeout = useRef(null);
  const handleTyping = (val) => {
    setText(val);
    socketRef.current?.emit("private:typing", { to: otherUser._id, isTyping: true });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current?.emit("private:typing", { to: otherUser._id, isTyping: false });
    }, 1200);
  };

  return (
    <div className="chat-window d-flex flex-column" style={{height: '500px', border: '1px solid #ddd'}}>
      <div className="chat-header p-2 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <strong>{otherUser.fullname}</strong>
          {connectionStatus === 'connecting' && <small style={{marginLeft:8, color:'#999'}}>Connecting...</small>}
          {connectionStatus === 'connected' && <small style={{marginLeft:8, color:'green'}}>● Connected</small>}
          {connectionStatus === 'auth_failed' && <small style={{marginLeft:8, color:'crimson'}}>Auth failed</small>}
          {connectionStatus === 'disconnected' && <small style={{marginLeft:8, color:'#999'}}>Disconnected</small>}
          {/* show online indicator from presence if available */}
        </div>
      </div>

      <div className="chat-messages flex-grow-1 overflow-auto p-2">
        {messages.map((m) => (
          <div key={m._id || m.createdAt} className={`d-flex mb-2 ${m.sender._id === userId ? 'justify-content-end' : ''}`}>
            <div style={{ maxWidth: '70%' }} className={`p-2 rounded ${m.sender._id === userId ? 'bg-primary text-white' : 'bg-light'}`}>
              <div style={{fontSize: '0.85rem'}}>{m.message}</div>
              <small className="text-muted d-block text-end">{new Date(m.createdAt).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="chat-input p-2 border-top">
        <div className="d-flex gap-2">
          <input value={text} onChange={(e) => handleTyping(e.target.value)} className="form-control" placeholder="Write a message..." />
          <button className="btn btn-primary" onClick={sendMessage}>Send</button>
        </div>
        {/* typing indicator */}
        {typingUsers[otherUser._id] && <small className="text-muted">Typing...</small>}
      </div>
    </div>
  );
}
