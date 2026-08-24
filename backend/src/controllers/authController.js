const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function generateToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    propertyName: user.propertyName,
    city: user.city,
  };
}

async function register(req, res) {
  try {
    const { name, email, password, propertyName, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha sao obrigatorios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Ja existe uma conta com este email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, propertyName, city });

    return res.status(201).json({
      user: toPublicUser(user),
      token: generateToken(user),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao cadastrar usuario.', details: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha sao obrigatorios.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha invalidos.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Email ou senha invalidos.' });
    }

    return res.json({
      user: toPublicUser(user),
      token: generateToken(user),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao fazer login.', details: err.message });
  }
}

async function me(req, res) {
  const user = await User.findByPk(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'Usuario nao encontrado.' });
  }
  return res.json(toPublicUser(user));
}

module.exports = { register, login, me };
