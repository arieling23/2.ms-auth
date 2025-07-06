const AuthUser = require('../models/AuthUser');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

async function loginUserService({ email, password }) {
  console.log('📩 Intentando login con:', email);

  if (!email || !password) {
    throw { status: 400, message: 'Email y contraseña requeridos.' };
  }

  const user = await AuthUser.findOne({ email });
  console.log('🔍 Usuario encontrado:', user);

  if (!user) {
    throw { status: 401, message: 'Correo o contraseña incorrectos.' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('✅ ¿Contraseña coincide?:', isMatch);

  if (!isMatch) {
    throw { status: 401, message: 'Correo o contraseña incorrectos.' };
  }

  const token = generateToken({
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role 
  });

  return { token };
}

module.exports = { loginUserService };
