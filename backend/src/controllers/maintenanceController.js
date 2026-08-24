const { Machine, Maintenance } = require('../models');

async function ensureOwnedMachine(machineId, userId) {
  return Machine.findOne({ where: { id: machineId, userId } });
}

async function list(req, res) {
  const machine = await ensureOwnedMachine(req.params.machineId, req.userId);
  if (!machine) {
    return res.status(404).json({ error: 'Maquina nao encontrada.' });
  }

  const maintenances = await Maintenance.findAll({
    where: { machineId: machine.id },
    order: [['date', 'DESC']],
  });

  return res.json(maintenances);
}

async function create(req, res) {
  try {
    const machine = await ensureOwnedMachine(req.params.machineId, req.userId);
    if (!machine) {
      return res.status(404).json({ error: 'Maquina nao encontrada.' });
    }

    const { type, date, hoursOrKm, description, cost, notes } = req.body;

    if (!type || !date || !description) {
      return res.status(400).json({ error: 'Tipo, data e descricao sao obrigatorios.' });
    }

    const maintenance = await Maintenance.create({
      machineId: machine.id,
      type,
      date,
      hoursOrKm,
      description,
      cost,
      notes,
    });

    if (hoursOrKm && hoursOrKm > machine.currentHours) {
      await machine.update({ currentHours: hoursOrKm });
    }

    return res.status(201).json(maintenance);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao registrar manutencao.', details: err.message });
  }
}

async function update(req, res) {
  const machine = await ensureOwnedMachine(req.params.machineId, req.userId);
  if (!machine) {
    return res.status(404).json({ error: 'Maquina nao encontrada.' });
  }

  const maintenance = await Maintenance.findOne({
    where: { id: req.params.id, machineId: machine.id },
  });

  if (!maintenance) {
    return res.status(404).json({ error: 'Registro de manutencao nao encontrado.' });
  }

  const { type, date, hoursOrKm, description, cost, notes } = req.body;
  await maintenance.update({ type, date, hoursOrKm, description, cost, notes });

  return res.json(maintenance);
}

async function remove(req, res) {
  const machine = await ensureOwnedMachine(req.params.machineId, req.userId);
  if (!machine) {
    return res.status(404).json({ error: 'Maquina nao encontrada.' });
  }

  const maintenance = await Maintenance.findOne({
    where: { id: req.params.id, machineId: machine.id },
  });

  if (!maintenance) {
    return res.status(404).json({ error: 'Registro de manutencao nao encontrado.' });
  }

  await maintenance.destroy();
  return res.status(204).send();
}

module.exports = { list, create, update, remove };
