const express = require('express');
const router = express.Router();
const { validateLogin, validateUsuario } = require('../middleware/validator');
const authController = require('../controllers/auth.controller');

// Rotas públicas
router.post('/login', validateLogin, authController.login);
router.post('/registrar', validateUsuario, authController.registrar);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router; 