const env = require('dotenv');
env.config({ path: '.env.local' });
const db = require('../../models');
const request = require('supertest');
const app = require('../../app');
const fs = require('fs');
const ftp = require('../../lib/ftp');

let accessToken;

describe('test', function () {
    before(async function () {
        await db.connect();
        await ftp.connect();
        const usersBuffer = fs.readFileSync('data/users.json');
        await ftp.putFile('users.json', usersBuffer);
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
    })

    it('list', function (done) {
        request(app)
            .get('/users')
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
    })

    it('get user by id', function (done) {
        request(app)
            .get(`/users/${1}`)
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

    it('get user by id', function (done) {
        request(app)
            .post(`/users/update`)
            .set({Authorization: accessToken})
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                else {
                    const data = res.body;
                    console.log(data);
                    done();
                }
            });
    });
})