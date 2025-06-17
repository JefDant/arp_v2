require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsConfig = require('./config/cors');
const authRoutes = require('./routes/auth');
const entidadesRoutes = require('./routes/entidades');
const usuariosRoutes = require('./routes/usuarios');
const atasRoutes = require('./routes/atas');
const aditivosRoutes = require('./routes/aditivos');
const empenhosRoutes = require('./routes/empenhos');
const pagamentosRoutes = require('./routes/pagamentos');

const app = express();

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use(express.json());
app.use(cors(corsConfig));

// Rota de teste
app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Rotas da API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/entidades', entidadesRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/atas', atasRoutes);
app.use('/api/v1/aditivos', aditivosRoutes);
app.use('/api/v1/empenhos', empenhosRoutes);
app.use('/api/v1/pagamentos', pagamentosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 