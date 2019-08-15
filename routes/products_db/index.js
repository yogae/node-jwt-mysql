const express = require('express');
const dao = require('./dao');
const router = express.Router();
const jwt = require('../../lib/jwtToken');
const ftp = require('../../lib/ftp');

const dbJsonPath = process.env.FTP_DB_JSON_PATH;

// POST /<base url>/products
// product 생성
router.post('/', jwt.checkAuthHeader('admin'), async function (req, res) {
    const product = req.body;
    const result = await dao.insert(product);
    res.status(201).json(result);
});

// POST /<base url>/products/update
// db prodcts update
// router.post('/update', jwt.checkAuthHeader('admin'), async function (req, res) {
//     const dbObj = await ftp.getObjOnce(dbJsonPath);
//     const result = await dao.updateDb(dbObj.item);
//     res.status(200).json(result);
// });

// GET /<base url>/products
// product list 반환
router.get('/', jwt.checkAuthHeader(['admin', 'guest']), async function (req, res) {
    const data = await dao.getList();
    res.status(200).json(data);
});

// GET /<base url>/products/:id
// <id>의 product 정보 반환
router.get('/:id', jwt.checkAuthHeader(['admin', 'guest']), async function (req, res) {
    const { id } = req.params;
    const data = await dao.getById(Number.parseInt(id));
    res.status(200).json(data);
});

// DELETE /<base url>/products/:id
// <id>의 product 삭제
router.delete('/:id', jwt.checkAuthHeader('admin'), async function (req, res) {
    const { id } = req.params;
    const data = await dao.deleteById(Number.parseInt(id));
    res.status(200).json(data);
});

module.exports = router;