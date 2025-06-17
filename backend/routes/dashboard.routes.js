const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboard.controller');

// Rotas protegidas
router.get('/', verificarToken, dashboardController.getDashboard);
router.get('/saldos', verificarToken, dashboardController.getSaldos);

module.exports = router; 