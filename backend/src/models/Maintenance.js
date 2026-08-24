const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Maintenance = sequelize.define('Maintenance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  machineId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'machine_id',
  },
  type: {
    type: DataTypes.ENUM(
      'abastecimento',
      'troca_oleo',
      'troca_pneu',
      'troca_peca',
      'revisao',
      'outro'
    ),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hoursOrKm: {
    type: DataTypes.FLOAT,
    field: 'hours_or_km',
    comment: 'Horimetro/hodometro no momento do registro',
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ex: Troca do oleo do motor, Pneu dianteiro direito, Diesel S10',
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'maintenances',
  underscored: true,
});

module.exports = Maintenance;
