const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const logger = require('../config/logger');

exports.verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario || !usuario.ativo) {
            return res.status(401).json({ message: 'Usuário não encontrado ou inativo' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        logger.error('Erro na verificação do token:', error);
        return res.status(401).json({ message: 'Token inválido' });
    }
};

exports.verificarNivelAcesso = (niveisPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        if (!niveisPermitidos.includes(req.usuario.nivel_acesso)) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        next();
    };
}; 