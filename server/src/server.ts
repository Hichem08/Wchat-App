import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health.js';
import { profileRouter } from './routes/profile.js';
import { friendsRouter } from './routes/friends.js';
import { chatsRouter } from './routes/chats.js';
import { authenticateSocket } from './middleware/auth.js';
import { setupSocketHandlers } from './socket/socketHandler.js';
import { startMessageCleanupJob } from './jobs/messageCleanupJob.js';

dotenv.config({ override: true });

const app = express();
const server = http.createServer(app);

const PORT = process.env.SOCKET_PORT || (process.env.PORT && process.env.PORT !== '8080' ? process.env.PORT : 4000);
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Express Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

// REST Routes
app.use('/health', healthRouter);
app.use('/api/profile', profileRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/chats', chatsRouter);

// Socket.IO Server Setup
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Socket Authentication Middleware
io.use(authenticateSocket);

// Socket Event Handlers
setupSocketHandlers(io);

// Start 24-hour auto-delete message cleanup background job
startMessageCleanupJob(10); // runs every 10 minutes

// Start Server
server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Wchat Real-Time Server running on port ${PORT}`);
  console.log(`📡 Socket.IO WebSocket ready for connections`);
  console.log(`⏱️  24-Hour Message Cleanup Job active`);
  console.log(`===============================================`);
});

export { app, server, io };
