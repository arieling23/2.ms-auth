// src/models/AuthUser.js
const mongoose = require('mongoose');

const authUserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 👈 solo si quieres almacenar el nombre
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

module.exports = mongoose.model('AuthUser', authUserSchema);
