# Rain Race

A multiplayer weather racing game where users compete based on rainfall in their locations.

## Setup

1. Install dependencies for both client and server:

```bash
npm install
```

2. Install server dependencies

```bash
cd rain-race-server
npm install
```

3. Start the application:

Development mode (runs both client and server):

```bash
npm run dev
```

# Client only

```bash
npm start
```

# Server only

```bash
npm run server
```



## Features

- Real-time weather updates
- Multiplayer support across different browsers
- Location-based gameplay
- Live rainfall tracking
- User presence synchronization

## Tech Stack

- React
- TypeScript
- WebSocket
- Vite
- Node.js

## Development

The application runs on:
- Client: http://localhost:5173
- WebSocket Server: ws://localhost:8080