require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const { startAuthConsumer } = require('./events/consumer');



const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);

// ✅ Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('🟢 Conectado a MongoDB');

    // ✅ Inicia el consumidor de eventos después de conectar la base
    startAuthConsumer();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://10.0.1.58:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('🔴 Error al conectar a MongoDB:', err.message);
  });
