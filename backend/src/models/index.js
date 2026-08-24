const sequelize = require('../config/database');
const User = require('./User');
const Machine = require('./Machine');
const Maintenance = require('./Maintenance');

User.hasMany(Machine, { foreignKey: 'userId', onDelete: 'CASCADE' });
Machine.belongsTo(User, { foreignKey: 'userId' });

Machine.hasMany(Maintenance, { foreignKey: 'machineId', onDelete: 'CASCADE', as: 'maintenances' });
Maintenance.belongsTo(Machine, { foreignKey: 'machineId' });

module.exports = {
  sequelize,
  User,
  Machine,
  Maintenance,
};
