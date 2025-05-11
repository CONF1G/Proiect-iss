import express from 'express';
import http from "http";
import { Server } from "socket.io";
import userRoutes from './src/routes/userRoutes.js';
import productsRoutes from './src/routes/productsRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import { checkConnection } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import cors from 'cors';


const app = express();
app.use(cors());
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Change to your frontend URL
    credentials: true,
  },
  path: "/socket.io",
});

// Track connected agents
const connectedAgents = new Set();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Store agent sockets (you might want to authenticate first)
  connectedAgents.add(socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedAgents.delete(socket);
  });

  // Optional: Handle role-based authentication
  socket.on('authenticate', (userData) => {
    if (userData.role === 'agent') {
      // Add to agents set
      connectedAgents.add(socket);
    }
  });
});

// Function to broadcast low stock alerts
export function broadcastLowStockAlert(product) {
  const alertMessage = {
    type: 'LOW_STOCK_ALERT',
    product: {
      id: product.id,
      name: product.name,
      stock: product.stock
    },
    timestamp: new Date().toISOString()
  };

  connectedAgents.forEach(agent => {
    if (agent.connected) {
      agent.emit('stock-alert', alertMessage);
    }
  });
}


// Middleware to make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.json("hello this is the backend")
});


app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/admin", adminRoutes);

// Use server.listen instead of app.listen for WebSocket support
server.listen(3300, async () => {
  console.log('Server running on port 3300');
  await checkConnection();
});