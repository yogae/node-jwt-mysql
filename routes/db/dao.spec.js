const dao = require('./dao');
const chai = require('chai');

describe('dao test', function () {
    it('getList', function () {
        const res = dao.getList();
        chai.expect(res.length > 0).to.be.equals(true);
    });

    it('getById', function () {
        const res = dao.getById(1);
        chai.expect(res.id).to.be.equals(1);
    });
})