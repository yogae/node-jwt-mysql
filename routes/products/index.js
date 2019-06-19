const express = require('express');
const router = express.Router();
const dao = require('./dao');

router.post('/', function (req, res) {
    res.status(200).end();
});

router.get('/', function (req, res) {
    const data = dao.getList();
    res.status(200).json(data);
});

router.get('/:id', function (req, res) {
    const { id } = req.params;
    const data = dao.getById(Number.parseInt(id));
    res.status(200).json(data);
});

router.post('/', function (req, res) {
    res.status(200).end();
});

module.exports = router;