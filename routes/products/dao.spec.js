const env = require('dotenv');
env.config({ path: '.env.local' });
const dao = require('./dao');
const db = require('../../models');
const products = require('../../data/db.json').item;
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
        const data = products.find((elem) => elem.id === docID);
        const res = await dao.insert(data);
    });

    it('getList', async function () {
        const res = await dao.getList();
        chai.expect(res.length > 0).to.be.equals(true);
    });

    it('getById', async function () {
        const res = await dao.getById(docID);
        chai.expect(res.id).to.be.equals(1);
    });

    it('deleteById', async function () {
        const res = await dao.deleteById(docID);
    });
})