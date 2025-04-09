import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';

import partnerRoutes from './src/routes/partner.routes.js';
import mcpRoutes from './src/routes/mcp.routes.js';

import { authenticate, authorize } from './src/middleware/auth.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB Connected'))
// .catch((err) => console.log('MongoDB Error:', err));

// User routes
app.use('/api/partner', authenticate, authorize('partner'), partnerRoutes);
app.use('/api/mcp', authenticate, authorize('mcp'), mcpRoutes);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

global.io = io;

io.on('connection', (socket) => {
    const { userId, role } = socket.handshake.query;
  
    if (!userId || !role) {
      console.log('Missing userId or role in socket connection');
      return;
    }
  
    const room = `${role}-${userId}`; // e.g., mcp-123 or partner-456
    socket.join(room);
  
    console.log(`User connected to room: ${room}`);
  
    socket.on('disconnect', () => {
      console.log(`User disconnected from room: ${room}`);
    });
  });
  

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});