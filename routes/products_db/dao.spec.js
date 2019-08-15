const env = require('dotenv');
env.config({ path: '.env.local' });
const dao = require('./dao');
const db = require('../../models');
const products = require('../../data/db.json').item;
const chai = require('chai');

let id;

describe('dao test', function () {
    this.timeout(10000);
    before(async function () {
        await db.connect();
    })

    after(async function () {
        await db.close();
    })

    it('insert', async function () {
        const res = await dao.insert({
            "pn": "07-310","des": "QUARTZ SHIPS CLOC","des1": "","kdes": "d 7cm","price": 0,"p_date": "2016.02.01","lev": 0,"category": "LIFESTYLE","supn": "JATGO","brand": "","series": "","keyword": "","origin": "","psq": 0,"ofq0": 0,"ofq1": 0,"deliv1": ".  .","poq": 0,"mstnote": "","slnote": "","img_ext": "jpg","pn_cat": "","pn_a": "","sspnt": ""
        });

        id = res.id
    });

    it('getList', async function () {
        const res = await dao.getList();
        chai.expect(res.length > 0).to.be.equals(true);
    });

    it('getById', async function () {
        const res = await dao.getById(id);
        chai.expect(res.id).to.be.equals(id);
    });

    it('deleteById', async function () {
        const res = await dao.deleteById(id);
    });

    it('updateUser', async function () {
        const result =await dao.updateDb(products);
        // console.log(result);
    });
})