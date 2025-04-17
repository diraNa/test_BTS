const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// const { notFound, errorHandler } = require('./middlewares');

const app = express();

require('dotenv').config();

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

const listTest = require('./routes/users');

app.use('/', listTest);

// app.use(notFound);
// app.use(errorHandler);

module.exports = app;
