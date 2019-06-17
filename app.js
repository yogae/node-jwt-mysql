const express = require('express');
const users = require('./routes/users');
const db = require('./routes/db');
const app = express();

app.get('/health', function (req, res) {
    res.status(200).end();
});

app.use(`/users`, users);
app.use(`/db`, db);

module.exports = app;