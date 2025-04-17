const argon2 = require('argon2');

const getHash = async (text) => {
  try {
    const hash = await argon2.hash(text, { timeCost: 2, memoryCost: 2 ** 11 }).catch((err) => {
      throw err;
    });
    return hash;
  } catch (error) {
    return error;
  }
};

const verifyHash = async (argon2Hash, text) => {
  try {
    // eslint-disable-next-line max-len
    const result = await argon2.verify(argon2Hash, text, { timeCost: 2, memoryCost: 11 }).catch((err) => {
      throw err;
    });
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getHash,
  verifyHash,
};
