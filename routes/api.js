const express = require('express');
const userRouter = require('./api/user');

const app = express();

app.use('/user', userRouter);

module.exports = app;
