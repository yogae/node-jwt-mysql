const env = require('dotenv');
env.config({ path: '.env.local' });
const ftp = require('./ftp');
const fs = require('fs');

describe('ftp test', function () {
    before(async () => {
        await ftp.connect();
    });

    after(async () => {
        await ftp.close();
    });

    it('put', async function () {
        const dbBuffer = fs.readFileSync('data/db.json');
        await ftp.putFile('db.json', dbBuffer);
    });

    it('put', async function () {
        const dbBuffer = fs.readFileSync('data/users.json');
        await ftp.putFile('users.json', dbBuffer);
    });

    it('list', async function () {
        const result = await ftp.getList();
        console.log(result);
    });

    it('get', async function () {
        await ftp.getFile('db.json', 'temp/test2.json');
    });

    it('get', async function () {
        const buffer = await ftp.getObj('users.json', 'euc-kr');
        console.log(buffer);
    })
})
