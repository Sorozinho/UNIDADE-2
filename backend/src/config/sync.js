const { sequelize } = require('../models');

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso.');
    process.exit(0);
  } catch (err) {
    console.error('Falha ao sincronizar o banco de dados:', err);
    process.exit(1);
  }
}

main();
