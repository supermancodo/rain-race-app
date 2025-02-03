import { useEffect, useRef } from "react";
import { User } from "../types";

export const useWebSocket = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number>();

  const connect = () => {
    wsRef.current = new WebSocket("ws://localhost:8080");

    wsRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
      if (users.length > 0) {
        wsRef.current?.send(JSON.stringify(users));
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      reconnectTimeoutRef.current = setTimeout(connect, 1000);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const serverUsers = JSON.parse(event.data);
        setUsers((prev) => {
          const currentUser = prev.find((u) => u.isOnline);
          if (!currentUser) return serverUsers;

          const updatedUsers = serverUsers.map((serverUser: User) => {
            if (serverUser.name === currentUser.name) {
              return { ...serverUser, isOnline: true };
            }
            const existingUser = prev.find((u) => u.name === serverUser.name);
            return existingUser
              ? { ...serverUser, isOnline: existingUser.isOnline }
              : serverUser;
          });

          return updatedUsers;
        });
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  };

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && users.length > 0) {
      wsRef.current.send(JSON.stringify(users));
    }
  }, [users]);
};
