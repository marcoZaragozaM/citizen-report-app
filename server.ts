import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';

import connectDB from './src/config/db';
import authRoutes from './src/routes/authRoutes';
import reportRoutes from './src/routes/reportRoutes';
import userRoutes from "./src/routes/userRoutes";

async function startServer() {
  const app = express(); // ✅ AQUÍ SÍ EXISTE
  const PORT = process.env.PORT || 3000;

  // DB
  await connectDB();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/users', userRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
  });

  // Vite dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

