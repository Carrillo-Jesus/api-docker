const express = require('express');
const authController = require('@/controllers/auth.controller');
const { verifyToken } = require('@/middlewares/auth');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Register User
router.post('/register', authController.register);

// Login User
router.post('/login', authController.login);

router.get('/confirm-account/:token', authController.confirmAccount);

router.get('/verify-token', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ auth: false, message: 'No autorizado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Error al autenticar, por favor inicie sesión nuevamente' });
      }

      return res.json({ auth: true, user: decoded });
     
    });

  });
module.exports = router;