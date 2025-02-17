const jwt = require('jsonwebtoken');
const { User } = require('../models');

const { JWT_SECRET } = process.env;
const jwtConfig = {
  expiresIn: '15m',
  algorithm: 'HS256',
};

const checkEmail = (email) => {
  if (email === undefined) return ({ status: 400, message: '"email" is required' });

  if (email.length === 0) {
    return ({ status: 400, message: '"email" is not allowed to be empty' });
  }
};

const checkPassword = (password) => {
  if (password === undefined) return ({ status: 400, message: '"password" is required' });

  if (password.length === 0) { 
    return ({ status: 400, message: '"password" is not allowed to be empty' });
  }
};

const checkLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const checkedEmail = checkEmail(email);

  if (checkedEmail) {
    return res
      .status(checkedEmail.status)
      .json({ message: checkedEmail.message });
  }

  const checkedPassword = checkPassword(password);

  if (checkedPassword) {
    return res
      .status(checkedPassword.status)
      .json({ message: checkedPassword.message });
  }

  const checkedUser = await User.findOne({ where: { email, password } });

  if (!checkedUser) return res.status(400).json({ message: 'Invalid fields' });

  const token = jwt.sign({ email }, JWT_SECRET, jwtConfig);

  req.user = { token };

  next();
};

module.exports = {
  checkLogin,
};
