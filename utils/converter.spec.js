const decoder = require('./converter');

describe('decoder test', function () {
    it('euc-kr -> utf8', function () {
        const buffer = decoder.euc2utf('data/db.json');
        const db = buffer.toString();
        console.log(db);
    });
})