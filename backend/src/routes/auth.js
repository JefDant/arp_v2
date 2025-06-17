const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'arp_user',
  password: process.env.DB_PASSWORD || 'arp123',
  database: process.env.DB_NAME || 'arp_db'
};

// Rota de login
router.post('/login', async (req, res) => {
  try {
    console.log('Tentativa de login recebida:', req.body);
    const { email, senha } = req.body;

    // Conectar ao banco de dados
    const connection = await mysql.createConnection(dbConfig);
    console.log('Conexão com banco de dados estabelecida');

    // Buscar usuário
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    console.log('Usuário encontrado:', rows.length > 0 ? 'Sim' : 'Não');

    await connection.end();

    if (rows.length === 0) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const usuario = rows[0];
    console.log('Comparando senhas...');
    console.log('Senha recebida:', senha);
    console.log('Hash armazenado:', usuario.senha_hash);

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    console.log('Senha válida:', senhaValida);

    if (!senhaValida) {
      console.log('Senha inválida');
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo_usuario
      },
      process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
      { expiresIn: '1d' }
    );
    console.log('Token gerado com sucesso');

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo_usuario
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router; 