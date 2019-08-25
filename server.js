const { config } = require('dotenv');
const colors = require('./utils/colors');
const express = require('express');
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { SECRET, PORT } = process.env;
const Authenticator = require('./auth/auth.js').Authenticator;


config({ debug: process.env.DEBUG }); // what does this object do in config? Enabbles some

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(SECRET));
app.use(Authenticator);

// USE ROUTES
app.use('/users', userRoutes);


mongoose.connect("mongodb://localhost/userdb", { useNewUrlParser: true });

app.listen(PORT, () =>
  console.log(` \nDatabase connection established! \nApp running on http://localhost:${PORT}`.verbose)
);
