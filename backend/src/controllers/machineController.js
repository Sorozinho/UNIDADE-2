const { Machine, Maintenance } = require('../models');

async function list(req, res) {
  const machines = await Machine.findAll({
    where: { userId: req.userId },
    order: [['createdAt', 'DESC']],
  });
  return res.json(machines);
}

async function create(req, res) {
  try {
    const { name, type, brand, model, year, identifier, currentHours, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O nome da maquina/veiculo e obrigatorio.' });
    }

    const machine = await Machine.create({
      userId: req.userId,
      name,
      type,
      brand,
      model,
      year,
      identifier,
      currentHours,
      notes,
    });

    return res.status(201).json(machine);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao cadastrar maquina.', details: err.message });
  }
}

async function getOne(req, res) {
  const machine = await Machine.findOne({
    where: { id: req.params.id, userId: req.userId },
    include: [{ model: Maintenance, as: 'maintenances' }],
    order: [[{ model: Maintenance, as: 'maintenances' }, 'date', 'DESC']],
  });

  if (!machine) {
    return res.status(404).json({ error: 'Maquina nao encontrada.' });
  }

  return res.json(machine);
}

async function update(req, res) {
  const machine = await Machine.findOne({ where: { id: req.params.id, userId: req.userId } });

  if (!machine) {
    return res.status(404).json({ error: 'Maquina nao encontrada.' });
  }

  const { name, type, brand, model, year, identifier, currentHours, notes } = req.body;

  await machine.update({ name, type, brand, model, year, identifier, currentHours, notes });

  return res.json(machine);
}

async function remove(req, res) {
  const machine = await Machine.findOne({ where: { id: req.params.id, userId: req.userId } });

  if (!machine) {
    return res.status(404).json({ error: 'Maquina nao encontrada.' });
  }

  await machine.destroy();
  return res.status(204).send();
}

module.exports = { list, create, getOne, update, remove };
