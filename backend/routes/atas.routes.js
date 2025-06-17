const express = require('express');
const router = express.Router();
const { verificarToken, verificarNivelAcesso } = require('../middleware/auth');
const { validateAta } = require('../middleware/validator');
const atasController = require('../controllers/atas.controller');

// Rotas públicas
router.get('/', verificarToken, atasController.listarAtas);
router.get('/:id', verificarToken, atasController.buscarAta);

// Rotas que requerem autenticação e nível de acesso específico
router.post('/', 
    verificarToken, 
    verificarNivelAcesso(['admin', 'gestor']), 
    validateAta, 
    atasController.criarAta
);

router.put('/:id', 
    verificarToken, 
    verificarNivelAcesso(['admin', 'gestor']), 
    validateAta, 
    atasController.atualizarAta
);

router.delete('/:id', 
    verificarToken, 
    verificarNivelAcesso(['admin']), 
    atasController.excluirAta
);

module.exports = router; 