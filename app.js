const express = require('express');
const users = require('./routes/users');
const app = express();

app.use(`/users`, users);

module.exports = app;