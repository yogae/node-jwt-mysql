const env = require('dotenv');
env.config({ path: '.env.local' });
const db = require('../../models');
const request = require('supertest');
const app = require('../../app');
const chai = require('chai');
const fs = require('fs');
const ftp = require('../../lib/ftp');

let accessToken;
let id;

describe('test', function () {
    before(async function () {
        await db.connect();
        await ftp.connect();
        const dbBuffer = fs.readFileSync('data/db.json');
        await ftp.putFile('db.json', dbBuffer);
        await ftp.close();
    })

    after(async function () {
        await db.close();
    })

    it('login', function (done) {
        request(app)
            .post('/users/login')
            .send({
                name: "parkmoonsoo",
                password: "234567890"
            })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                else {
                    accessToken = res.body.accessToken;
                    // console.log(accessToken);
                    done();
                }
            })
    });

    it('create product', function (done) {
        request(app)
            .post('/products')
            .set({ Authorization: accessToken })
            .send({
                "pn": "HJ84MS","des": "QUARTZ SHIPS CLOC","des1": "","kdes": "d","price": 89000,"p_date": "2016.01.26","lev": 0,"category": "LIFESTYLE","supn": "JATGO","brand": "","series": "","keyword": "","origin": "","psq": 0,"ofq0": 0,"ofq1": 0,"deliv1": ".  .","poq": 0,"mstnote": "","slnote": "","img_ext": "jpg","pn_cat": "HJ84MS","pn_a": "","sspnt": ""
            })
            .expect(201)
            .end((err, res) => {
                if (err) throw err;
                else {
                    const result = res.body;
                    console.log(result.id);
                    id = result.id;
                    done();
                }
            })
    });

    it('list product', function (done) {
        request(app)
            .get('/products')
            .set({ Authorization: accessToken })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                else {
                    const result = res.body;
                    // console.log(result);
                    done();
                }
            })
    });

    it('get one product', function (done) {
        request(app)
            .get(`/products/${id}`)
            .set({ Authorization: accessToken })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                else {
                    const result = res.body;
                    // console.log(result);
                    done();
                }
            })
    });

    it('delete product', function (done) {
        request(app)
            .delete(`/products/${id}`)
            .set({ Authorization: accessToken })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                else {
                    const result = res.body;
                    // console.log(result);
                    done();
                }
            })
    });

    it('get user by id', function (done) {
        request(app)
            .post(`/products/update`)
            .set({Authorization: accessToken})
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                else {
                    const data = res.body;
                    // console.log(data);
                    done();
                }
            });
    });
})