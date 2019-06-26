const PromiseFtp = require('promise-ftp');
const fs = require('fs');
const JSONStream = require('JSONStream');

const ftpHost = process.env.FTP_HOST;
const ftpUser = process.env.FTP_USER;
const ftpPassword = process.env.FTP_PASSWORD;

const ftp = new PromiseFtp();
const connect = function () {
    return ftp.connect({host: ftpHost, user: ftpUser, password: ftpPassword});
}

const getList = async function () {
    const list = await ftp.list('/');
    return list;
}

const putFile = async function (ftpPath, buffer) {
    return ftp.put(buffer, ftpPath);
}

const getFile = async function (ftpPath, localPath) {
    const stream = await ftp.get(ftpPath);
    stream.pipe(fs.createWriteStream(localPath));
    await new Promise((resolve, reject) => {
        stream.once('close', resolve);
    });
}


const getObj = async function (ftpPath) {
    const stream = await ftp.get(ftpPath);
    stream.pipe(JSONStream.parse())
    return new Promise((resolve, reject) => {
        let jsonObj;
        stream.on('data', function (data) {
            jsonObj = JSON.parse(data.toString());
        })
        stream.on('close', function () {
            resolve(jsonObj);
        });
    });
}

const close = function () {
    return ftp.end();
}

const getObjOnce = async function (ftpPath) {
    await connect();
    const obj = await getObj(ftpPath);
    await close();
    return obj;
}

module.exports = {
    connect,
    close,
    getList,
    getFile,
    getObj,
    putFile,
    getObjOnce,
}