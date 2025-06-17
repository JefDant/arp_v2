const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nivel_acesso: {
    type: DataTypes.ENUM('admin', 'gestor', 'usuario'),
    defaultValue: 'usuario'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ultimo_login: {
    type: DataTypes.DATE
  },
  tentativas_login: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bloqueado_ate: {
    type: DataTypes.DATE
  },
  tipo_usuario: {
    type: DataTypes.ENUM('ADMIN', 'MASTER', 'USER'),
    allowNull: false
  },
  entidade_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'entidades',
      key: 'id'
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha')) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    }
  }
});

// Método para verificar senha
Usuario.prototype.verificarSenha = async function(senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = Usuario; 