const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ata = sequelize.define('Ata', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    modalidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fornecedor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pendente', 'Aprovada', 'Cancelada'),
        defaultValue: 'Pendente'
    },
    observacoes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'atas',
    timestamps: true
});

module.exports = Ata; 