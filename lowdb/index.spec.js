const lowdb = require('./index');


describe('lowdb test', function () {
    it('get', function () {
        const item = lowdb.getDb().get('item').find({ id: 1 }).value()
        console.log(item);
    });

    it('insert', function () {
        const item = lowdb.getDb().get('item').insert({
            "pn": "07-310","des": "QUARTZ SHIPS CLOC","des1": "","kdes": "d 7cm","price": 0,"p_date": "2016.02.01","lev": 0,"category": "LIFESTYLE","supn": "JATGO","brand": "","series": "","keyword": "","origin": "","psq": 0,"ofq0": 0,"ofq1": 0,"deliv1": ".  .","poq": 0,"mstnote": "","slnote": "","img_ext": "jpg","pn_cat": "","pn_a": "","sspnt": ""
        }).write();
        console.log(item) ;
    });
});