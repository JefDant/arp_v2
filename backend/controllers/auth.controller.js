const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Usuario, RefreshToken } = require('../models');
const logger = require('../config/logger');

const MAX_TENTATIVAS_LOGIN = 5;
const TEMPO_BLOQUEIO = 30 * 60 * 1000; // 30 minutos

const gerarRefreshToken = async (usuario) => {
    const token = crypto.randomBytes(40).toString('hex');
    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7); // 7 dias

    await RefreshToken.create({
        token,
        usuario_id: usuario.id,
        expira_em: expiraEm
    });

    return token;
};

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Verificar se a conta está bloqueada
        if (usuario.bloqueado_ate && usuario.bloqueado_ate > new Date()) {
            return res.status(401).json({
                message: `Conta bloqueada. Tente novamente após ${new Date(usuario.bloqueado_ate).toLocaleString()}`
            });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            // Incrementar tentativas de login
            usuario.tentativas_login = (usuario.tentativas_login || 0) + 1;

            // Bloquear conta se exceder tentativas
            if (usuario.tentativas_login >= MAX_TENTATIVAS_LOGIN) {
                usuario.bloqueado_ate = new Date(Date.now() + TEMPO_BLOQUEIO);
                await usuario.save();
                return res.status(401).json({
                    message: `Conta bloqueada por ${TEMPO_BLOQUEIO / 60000} minutos devido a múltiplas tentativas de login`
                });
            }

            await usuario.save();
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Resetar tentativas de login
        usuario.tentativas_login = 0;
        usuario.ultimo_login = new Date();
        await usuario.save();

        // Gerar tokens
        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = await gerarRefreshToken(usuario);

        res.json({
            token,
            refreshToken,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                nivel_acesso: usuario.nivel_acesso
            }
        });
    } catch (error) {
        logger.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro ao realizar login' });
    }
};

exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const token = await RefreshToken.findOne({
            where: {
                token: refreshToken,
                usado: false,
                expira_em: { [Op.gt]: new Date() }
            },
            include: [Usuario]
        });

        if (!token) {
            return res.status(401).json({ message: 'Refresh token inválido ou expirado' });
        }

        // Gerar novo token de acesso
        const newToken = jwt.sign(
            { id: token.Usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Gerar novo refresh token
        const newRefreshToken = await gerarRefreshToken(token.Usuario);

        // Marcar token atual como usado
        token.usado = true;
        await token.save();

        res.json({
            token: newToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        logger.error('Erro ao refresh token:', error);
        res.status(500).json({ message: 'Erro ao renovar token' });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const token = await RefreshToken.findOne({
            where: { token: refreshToken, usado: false }
        });

        if (token) {
            token.usado = true;
            await token.save();
        }

        res.status(204).send();
    } catch (error) {
        logger.error('Erro ao fazer logout:', error);
        res.status(500).json({ message: 'Erro ao fazer logout' });
    }
};

exports.registrar = async (req, res) => {
    try {
        const { nome, email, senha, nivel_acesso } = req.body;

        // Verificar se email já existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Criar usuário
        const senhaHash = await bcrypt.hash(senha, 10);
        const usuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            nivel_acesso: nivel_acesso || 'usuario'
        });

        // Gerar tokens
        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = await gerarRefreshToken(usuario);

        res.status(201).json({
            token,
            refreshToken,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                nivel_acesso: usuario.nivel_acesso
            }
        });
    } catch (error) {
        logger.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
}; 