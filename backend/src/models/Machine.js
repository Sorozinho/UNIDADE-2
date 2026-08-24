const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Machine = sequelize.define('Machine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('trator', 'colheitadeira', 'pulverizador', 'caminhao', 'implemento', 'outro'),
    allowNull: false,
    defaultValue: 'outro',
  },
  brand: {
    type: DataTypes.STRING,
  },
  model: {
    type: DataTypes.STRING,
  },
  year: {
    type: DataTypes.INTEGER,
  },
  identifier: {
    type: DataTypes.STRING,
    comment: 'Placa, numero de serie ou codigo interno',
  },
  currentHours: {
    type: DataTypes.FLOAT,
    field: 'current_hours',
    defaultValue: 0,
    comment: 'Horimetro ou hodometro atual',
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'machines',
  underscored: true,
});

module.exports = Machine;
