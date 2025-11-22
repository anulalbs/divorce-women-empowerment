import { io } from "socket.io-client";

let socket = null;

export function connectSocket(token) {
  if (socket) return socket;
  // Use provided token or fallback to localStorage (JWT)
  const authToken = token || localStorage.getItem("token");
  console.log("[socket] connect authToken present:", !!authToken);
  // Connect to backend socket server (align with axios baseURL host)
  socket = io("http://localhost:5010", {
    path: "/socket.io",
    auth: { token: authToken }, // sent as handshake auth (expects JWT)
  });
  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
