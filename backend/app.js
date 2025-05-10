// app.js
import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import productsRoutes from './src/routes/productsRoutes.js';
import { checkConnection } from './src/config/db.js';

// import createAllTable from './utils/dbUtils.js';
import authRoutes from './src/routes/authRoutes.js';
import cors from 'cors'

const app = express();
app.use(cors());
app.get("/", (req, res) => {
     res.json("hello this is the backend")
});


app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/users', userRoutes); // Use user routes for API calls
app.use('/api/auth', authRoutes); // Use user routes for API calls
//crud products
app.use('/api/products', productsRoutes);
app.use('/api/orders', productsRoutes);

app.listen(3300, async() => {
  console.log('Server running on port 3300');
});
