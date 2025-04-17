const jwt = require('jsonwebtoken');
// const config = require('../infra/configs/global_config');
// const wrapper = require('../helpers/utils/wrapper');
// const logger = require('../helpers/utils/logger');
// const { UnauthorizedError } = require('../helpers/error');
// const jwtConfig = config.get('/jwt');

const generateToken = async (payload, options = {}) => {
  const defaultOptions = {
    expiresIn: '1h',
    subject: '',
    ...options,
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET, defaultOptions);
};

const getToken = (headers) => {
  if (headers && headers.authorization && headers.authorization.includes('Bearer')) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
  }
  return undefined;
};

// eslint-disable-next-line consistent-return
const verifyToken = (req, res, next) => {
  const token = getToken(req.headers);
  if (!token) {
    return res.sendStatus(401);
  }

  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log('JWTAuth.verifyToken', 'Failed to verify token', 'jwt.verify', err);

    if (err instanceof jwt.TokenExpiredError) {
      // decodedToken = new UnauthorizedError('Access token expired.');
      console.log('Access token expired');
    }

    if (err instanceof jwt.JsonWebTokenError) {
      // decodedToken = new UnauthorizedError('Invalid token.');
      console.log('Invalid token');
    }

    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;

    next();
  });
};

module.exports = {
  generateToken,
  verifyToken,
  getToken,
};
