const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/unauthorized-error');

const JWT_SECTER = 'super-secret-key';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.headers);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnAuthorizedError('Необходима авторизаци'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECTER);
  } catch (err) {
    return next(new UnAuthorizedError('Необходима авторизаци'));
  }
  req.user = payload;

  return next();
};
