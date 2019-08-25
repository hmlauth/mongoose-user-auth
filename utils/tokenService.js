// In utils/tokenService.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { SECRET } = process.env;

module.exports = {
  createToken: async user => {
    try {
      let token = await jwt.sign(
        { user, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
        SECRET
      );
      return token;
    } catch (err) {
      if (err) throw err;
    }
  },

  isValidToken: async token => {
    try {
      console.log(token)
      let decoded = await jwt.verify(token, SECRET);
      console.log('decoded'.info, decoded);
      return decoded;
    } catch (err) {
      if (err) throw err;
    }
  }
};
