const env = require('dotenv');
env.config({ path: '.env.local' });
const dao = require('./dao');
const db = require('../../models');
const chai = require('chai');

describe('dao test', function () {
    before(async function () {
        await db.connect();
    })

    after(async function () {
        await db.close();
    })

    it('insert', async function () {
        const res = await dao.insert();
        console.log(res);
    });

    it('getList', async function () {
        const res = await dao.getList();
        console.log(res);
        chai.expect(res.length > 0).to.be.equals(true);
    });

    it('getById', async function () {
        const res = await dao.getById(1);
        chai.expect(res.id).to.be.equals(1);
    });
})