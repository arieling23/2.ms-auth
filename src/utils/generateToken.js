const jwt = require('jsonwebtoken');

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('❌ JWT_SECRET no definido en el archivo .env');
  }

  return jwt.sign(
    {
      userId: user._id,             
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

module.exports = generateToken;
