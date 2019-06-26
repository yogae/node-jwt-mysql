const env = require('dotenv');
env.config({ path: '.env.local' });
const dao = require('./dao');
const db = require('../../models');
const users = require('../../data/users.json').users;
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
            "name": "hinggildong","email": "hinggildong@daum.kr","password": "123456789","hname": "hname","htel": "","lev": "1", "role": "guest"
        });
        id = res.id;
    });

    it('getList', async function () {
        const res = await dao.getList();
        console.log(res);
        chai.expect(res.length > 0).to.be.equals(true);
    });

    it('getuser', async function () {
        const res = await dao.findUser('parkmoonsoo', '234567890');
    });

    it('deleteById', async function () {
        const res = await dao.deleteById(id);
    });

    it('deleteById', async function () {
        const res = await dao.deleteById(id);
    });

    it('updateUser', async function () {
        const result =await dao.updateDb(users);
        console.log(result);
    })
})