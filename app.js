const express = require('express');
const users = require('./routes/users');
const products = require('./routes/products');
const app = express();

app.get('/health', function (req, res) {
    res.status(200).end();
});
app.use(`/users`, users);
app.use(`/products`, products);

module.exports = app;