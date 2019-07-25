const express = require('express');
const router = express.Router();
const dao = require('./dao');
const jwt = require('../../lib/jwtToken');
const ftp = require('../../lib/ftp');
// user 생성은 보안이 필요합니다.
// router.post('/', async function (req, res) {
//     const user = req.body;
//     const result = await dao.insert(user);
//     res.status(201).json(result);
// });

const userJsonPath = process.env.FTP_USER_JSON_PATH;

// POST /<base url>/users/login
// token을 반환
router.post('/login', async function (req, res) {
    const { name, password } = req.body;
    const user = await dao.findUser(name, password);
    if (user) {
        const token = jwt.getToken(name, 'admin', user.email);
        res.status(200).json({
            accessToken: token,
        });
    } else {
        res.status(401).end();
    }
});

// POST /<base url>/users/update
// db update endpoint
// router.post('/update', jwt.checkAuthHeader(['admin']), async function (req, res) {
//     const userObj = await ftp.getObjOnce(userJsonPath);
//     const result = await dao.updateDb(userObj.users);
//     res.status(200).json(result);
// });

// GET /<base url>/users
// user list 반환
router.get('/', jwt.checkAuthHeader('admin'), async function (req, res) {
    const userList = await dao.getList();
    res.status(200).json(userList);
});

// GET /<base url>/users/:id
// <id>의 사용자 정보 반환
router.get('/:id', jwt.checkAuthHeader(['admin', 'guest']), async function (req, res) {
    const { id } = req.params;
    const user = await dao.getById(Number.parseInt(id));
    res.status(200).json(user);
});

// DELETE /<base url>/users/:id
// <id>의 사용자 삭제
// router.delete('/:id', jwt.checkAuthHeader('admin'), async function (req, res) {
//     const { id } = req.params;
//     const user = await dao.deleteById(Number.parseInt(id));
//     res.status(200).json(user);
// });

module.exports = router;
