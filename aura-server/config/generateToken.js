// aura-server/config/generateToken.js (или utils/generateToken.js)
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Токен будет действителен 30 дней
  });
};

module.exports = generateToken;