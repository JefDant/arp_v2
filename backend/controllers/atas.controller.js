const { Ata } = require('../models');
const logger = require('../config/logger');

// Listar atas
const listarAtas = async (req, res) => {
    try {
        const atas = await Ata.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(atas);
    } catch (error) {
        logger.error('Erro ao listar atas:', error);
        res.status(500).json({ message: 'Erro ao listar atas' });
    }
};

// Buscar ata por ID
const buscarAta = async (req, res) => {
    try {
        const ata = await Ata.findByPk(req.params.id);
        if (!ata) {
            return res.status(404).json({ message: 'Ata não encontrada' });
        }
        res.json(ata);
    } catch (error) {
        logger.error('Erro ao buscar ata:', error);
        res.status(500).json({ message: 'Erro ao buscar ata' });
    }
};

// Criar ata
const criarAta = async (req, res) => {
    try {
        const ata = await Ata.create(req.body);
        res.status(201).json(ata);
    } catch (error) {
        logger.error('Erro ao criar ata:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Número de ata já existe' });
        }
        res.status(500).json({ message: 'Erro ao criar ata' });
    }
};

// Atualizar ata
const atualizarAta = async (req, res) => {
    try {
        const ata = await Ata.findByPk(req.params.id);
        if (!ata) {
            return res.status(404).json({ message: 'Ata não encontrada' });
        }

        await ata.update(req.body);
        res.json(ata);
    } catch (error) {
        logger.error('Erro ao atualizar ata:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Número de ata já existe' });
        }
        res.status(500).json({ message: 'Erro ao atualizar ata' });
    }
};

// Excluir ata (soft delete)
const excluirAta = async (req, res) => {
    try {
        const ata = await Ata.findByPk(req.params.id);
        if (!ata) {
            return res.status(404).json({ message: 'Ata não encontrada' });
        }

        await ata.destroy();
        res.status(204).send();
    } catch (error) {
        logger.error('Erro ao excluir ata:', error);
        res.status(500).json({ message: 'Erro ao excluir ata' });
    }
};

module.exports = {
    listarAtas,
    buscarAta,
    criarAta,
    atualizarAta,
    excluirAta
}; 