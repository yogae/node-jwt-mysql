const env = require('dotenv');
env.config({ path: '.env.local' });
const dao = require('./dao');
const db = require('../../models');
const users = require('../../data/users.json').users;
const chai = require('chai');

describe('dao test', function () {
    this.timeout(10000);
    const docID = 1;
    before(async function () {
        await db.connect();
    })

    after(async function () {
        await db.close();
    })

    it('insert', async function () {
        const data = users.find((elem) => elem.id === docID);
        const res = await dao.insert(data);
        console.log(res);
    });

    it('getList', async function () {
        const res = await dao.getList();
        // console.log(res);
        chai.expect(res.length > 0).to.be.equals(true);
    });

    it('deleteById', async function () {
        const res = await dao.deleteById(docID);
    });
})