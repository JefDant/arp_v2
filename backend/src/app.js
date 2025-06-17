const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');

const app = express();

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Rotas
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/entidades', require('./routes/entidades'));
app.use('/api/v1/usuarios', require('./routes/usuarios'));
app.use('/api/v1/atas', require('./routes/atas'));
app.use('/api/v1/aditivos', require('./routes/aditivos'));
app.use('/api/v1/empenhos', require('./routes/empenhos'));
app.use('/api/v1/pagamentos', require('./routes/pagamentos'));

// Rota de teste
app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

module.exports = app; 