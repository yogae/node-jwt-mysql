const express = require('express');
const users = require('./routes/users');
const products = require('./routes/products');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// 보안상의 이유로 브라우저들이 다른 도메인에게 XHR 요청을 보내는 것을 제한한 것입니다.
// Access-Control-Allow-Origin 설정
// 아래와 같이 등록하면 모든 도메인에 대하여 허용하게 됩니다.
app.use(cors());
// app.user(cors({  origin: '<특정 도메인>' }))
//body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));
//body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

// 서버 health check endpoint
app.get('/health', function (req, res) {
    res.status(200).end();
});
// user 관련 routes
app.use(`/users`, users);
// products 관련 routes
app.use(`/products`, products);

// not found 404 error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    return res.status(status).json(err.message);
});

module.exports = app;