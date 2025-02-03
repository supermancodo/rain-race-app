import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  rainfall: number;
  weather: {
    temperature: string;
    condition: string;
    rainfall: number;
  };
  isOnline: boolean;
  sessionId: string;
}

let users: User[] = [];

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");
  let clientSessionId: string | null = null;

  ws.send(JSON.stringify(users));

  ws.on("message", (data: string) => {
    try {
      const updatedUsers: User[] = JSON.parse(data);
      let hasChanges = false;

      updatedUsers.forEach((newUser) => {
        if (!clientSessionId && newUser.isOnline) {
          clientSessionId = newUser.sessionId;
        }

        const existingIndex = users.findIndex(
          (u) => u.sessionId === newUser.sessionId
        );

        if (existingIndex !== -1) {
          if (
            users[existingIndex].location !== newUser.location ||
            users[existingIndex].isOnline !== newUser.isOnline ||
            users[existingIndex].latitude !== newUser.latitude ||
            users[existingIndex].longitude !== newUser.longitude ||
            users[existingIndex].rainfall !== newUser.rainfall
          ) {
            users[existingIndex] = newUser;
            hasChanges = true;
          }
        } else {
          users.push(newUser);
          hasChanges = true;
        }
      });

      if (clientSessionId) {
        users = users.filter(
          (user) =>
            user.sessionId !== clientSessionId ||
            updatedUsers.some((u) => u.sessionId === user.sessionId)
        );
      }

      if (hasChanges) {
        wss.clients.forEach((client: WebSocket) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(users));
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    if (clientSessionId) {
      users = users.map((user) =>
        user.sessionId === clientSessionId ? { ...user, isOnline: false } : user
      );
      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(users));
        }
      });
    }
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8080");
