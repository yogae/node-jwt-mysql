const env = require('dotenv');
env.config({ path: '.env.local' });
const jwt = require('./jwtToken');

describe('test', function () {
    let token;
    it('getToken', function () {
        token = jwt.getToken('admin');
        console.log(token);
    });

    it('verify', function () {
        const ver = jwt.verify(token);
        console.log(ver);
    });

    it('decode', function () {
        const de = jwt.decode(token);
        console.log(de);
    });
});