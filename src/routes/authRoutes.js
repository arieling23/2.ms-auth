const express = require('express');
const {
  loginUser,
  changePassword,
  updatePasswordWithEmail, 
} = require('../controllers/authController');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();


router.post('/login', loginUser);


router.put('/change-password', verifyJWT, changePassword);


router.put('/update-password', updatePasswordWithEmail);

module.exports = router;
