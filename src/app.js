require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const { startAuthConsumer } = require('./events/consumer');

const app = express();
const PORT = process.env.PORT || 3002;


const corsOptions = {
  origin: 'http://540.225.75:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


// Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
