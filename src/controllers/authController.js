const { loginUserService } = require('../services/authService');
const AuthUser = require('../models/AuthUser');
const bcrypt = require('bcryptjs');


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService({ email, password });
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      ...result,
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(error.status || 500).json({ message: error.message || 'Error interno del servidor' });
  }
};


const changePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.userId; 

  if (!newPassword) {
    return res.status(400).json({ message: 'La nueva contraseña es obligatoria.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await AuthUser.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updatePasswordWithEmail = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email y nueva contraseña son requeridos.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await AuthUser.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('❌ Error al actualizar contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  loginUser,
  changePassword,
  updatePasswordWithEmail, 
};
