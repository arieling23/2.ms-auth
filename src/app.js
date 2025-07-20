require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const { startAuthConsumer } = require('./events/consumer');

const app = express();
const PORT = process.env.PORT || 3002;

const corsOptions = {
  origin: 'http://54.225.75.133:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// CORS Middleware
app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use('/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('🟢 Conectado a MongoDB');
    startAuthConsumer();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://54.85.0.204:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('🔴 Error al conectar a MongoDB:', err.message);
  });
