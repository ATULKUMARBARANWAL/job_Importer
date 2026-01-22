// client/utils/socket.js
import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  // ⛔ Prevent SSR execution
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        transports: ["websocket"],
      }
    );
  }

  return socket;
};
