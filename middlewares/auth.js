const jwt = require('jsonwebtoken');

const JWT_SECTER = 'super-secret-key';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
console.log(req.headers);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECTER);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизаци' });
  }
  req.user = payload;

  return next();
};
