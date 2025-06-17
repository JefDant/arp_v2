const { sequelize } = require('../config/database');
const { Ata } = require('../models');
const logger = require('../config/logger');

const getSaldos = async (req, res) => {
    try {
        const { entidade_id } = req.usuario;

        const saldos = await sequelize.query(`
            SELECT * FROM vw_saldos_atas
            WHERE entidade_id = :entidade_id
            ORDER BY numero
        `, {
            replacements: { entidade_id },
            type: sequelize.QueryTypes.SELECT
        });

        res.json(saldos);
    } catch (error) {
        console.error('Erro ao buscar saldos:', error);
        res.status(500).json({ message: 'Erro ao buscar saldos das atas' });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        // Buscar total de atas
        const totalAtas = await Ata.count();

        // Buscar atas pendentes (status = 'Pendente')
        const atasPendentes = await Ata.count({
            where: {
                status: 'Pendente'
            }
        });

        // Buscar valor total de todas as atas
        const valorTotal = await Ata.sum('valor');

        // Buscar últimas 5 atas
        const ultimasAtas = await Ata.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['numero', 'modalidade', 'fornecedor', 'data', 'valor', 'status']
        });

        res.json({
            total_atas: totalAtas,
            atas_pendentes: atasPendentes,
            valor_total: valorTotal || 0,
            ultimas_atas: ultimasAtas
        });
    } catch (error) {
        logger.error('Erro ao buscar dados do dashboard:', error);
        res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
    }
};

module.exports = {
    getSaldos,
    getDashboard
}; 