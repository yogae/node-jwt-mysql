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
        await ftp.putFile('test2.json', dbBuffer);
    });

    it('list', async function () {
        const result = await ftp.getList();
        console.log(result);
    });

    it('get', async function () {
        await ftp.getFile('test2.json', 'temp/test2.json');
    });

    it('get', async function () {
        const buffer = await ftp.getObj('test2.json');
        console.log(buffer);
    })
})