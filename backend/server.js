require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./config/logger');
const requestLogger = require('./middleware/request-logger');
const sequelize = require('./config/database');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const atasRoutes = require('./routes/atas.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(requestLogger);

// Rotas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/atas', atasRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
    logger.error('Erro não tratado:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3003;
const HOST = process.env.HOST || '31.97.18.235';

app.listen(PORT, HOST, () => {
    logger.info(`Servidor rodando em http://${HOST}:${PORT}`);
});

// Sincronizar banco de dados
sequelize.sync({ alter: true })
    .then(() => {
        logger.info('Banco de dados sincronizado');
    })
    .catch(err => {
        logger.error('Erro ao sincronizar banco de dados:', err);
    }); 