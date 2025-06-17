const { Sequelize } = require('sequelize');
const logger = require('./logger');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'arp_v2',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: (msg) => logger.debug(msg),
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Testar conexão
sequelize.authenticate()
    .then(() => {
        logger.info('Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch(err => {
        logger.error('Erro ao conectar com o banco de dados:', err);
    });

module.exports = sequelize; 