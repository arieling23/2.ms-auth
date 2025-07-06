const express = require('express');
const {
  loginUser,
  changePassword,
  updatePasswordWithEmail, 
} = require('../controllers/authController');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

// Ruta pública de login
router.post('/login', loginUser);

// Ruta protegida para cambiar contraseña (requiere JWT)
router.put('/change-password', verifyJWT, changePassword);

// ✅ Ruta pública para actualizar contraseña con email (desde ms-password-recovery)
router.put('/update-password', updatePasswordWithEmail);

module.exports = router;
