const uuid = require('uuid/v4');
const colors = require('../utils/colors');
const db = require('../models');
const { hashPassword, checkPassword } = require('../utils/passwordService');
const { createToken, isValidToken } = require('../utils/tokenService');

const cookieOptions = {
  expires: new Date(Date.now() + 900000),
  httpOnly: true,
  // secure: true, on deployment for https
  signed: true
};

console.log(db);

module.exports = {
  async testIt(req, res) {
    try {
      res.json({ message: 'Express is up!' });
    } catch (err) {
      if (err) throw err
    }
  },

  async getUsers(req, res) {
    try {
      db.User.find({})
        .then(dbAllUsers => {
          console.log(dbAllUsers);
          res.json(dbAllUsers)
        })
    } catch (err) {
      if (err) throw err;
    }
  },

  async register(req, res) {
    console.log('you hit the register in route\n', req.body);
    const { password, username } = req.body;
    try {
      // What we are doing here is requiring a package `uuid` which creates a unique id for our newUser object (ex: 'ed13a81d-1891-4cbc-960b-ab366307765a')
      // Then, we use our `hashPassword` middleware function and pass our password from the req.body.

      let newUser = {
        uuid: uuid(),
        username,
        password,
        hashPassword: await hashPassword(password)
      };

      console.log(newUser);

      // We then push our `newUser` to our `dbUsers.json file/array`
      // Then, send a status code to our client and redirect to our `/users/all route`.
      db.User.create(newUser);

      let token = await createToken(newUser);
      console.log('token'.silly, token);

      // here we give cookie the name authExample, cookie is created with the jwt token
      // token is stored in the cookie and it's just data. Cookie doesn't care what token is.
      res
        .cookie('authExample', token, cookieOptions)
        .status(200)
        .redirect('/users/authorized');

    } catch (err) {
      if (err) throw err;
    }
  },

  async login(req, res) {
    console.log('you hit the login route\n'.info, req.body);
    const { username, password } = req.body;
    try {

      db.User.findOne({username: username})
        .then(async dbUser => {
          console.log('dbUser\n'.info, dbUser)
          if (dbUser) {
            let isMatch = await checkPassword(password, dbUser.hashPassword);
            console.log('isMatch'.verbose, isMatch);

            let token = await createToken(dbUser);
            console.log('token'.verbose, token);

            res.cookie('token', token, cookieOptions);

            if (isMatch) {
              res.status(200).redirect('/users/authorized');
            } else {
              res.send('sorry password did not match');
            }
          } else {
            res.send('sorry username does not match');
          }
      })
    } catch (err) {
      if (err) throw err;
    }
  },

  async logout(req, res) {
    console.log('you hit the logout in route');
    try {
      res
        .clearCookie('token')
        .redirect('/users/all');
    } catch (err) {
      if (err) throw err;
    }
  },

  async cookieCheck(req, res) {
    const { token } = req.signedCookies;
    if (token) {
      try {
        let {user: { username, hashPassword }} = await isValidToken(token);
        db.User.find({username})
          .then(dbUser =>
            res.send({
              username: user.username,
              password: user.hashPassword
            }))
      } catch (err) {
        if (err) throw err;
      }
    } else {
      res.send({ message: 'Sorry your token has expired.' });
    }
  }, // how to test this function?

  async authorized(req, res) {
    res.send('users/authorized redirect hit')
  }
}
