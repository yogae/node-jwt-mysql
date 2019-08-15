const PromiseFtp = require('promise-ftp');
const fs = require('fs');
const JSONStream = require('JSONStream');
const iconv = require('iconv-lite');

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

// ftp file의 수정 시간을 반환
const getModifyDate = async function (ftpPath) {
    return ftp.lastMod(ftpPath)
        .then((date) => {
            return date.getTime();
        });
}

function convertEncoding (bBuffer) {
    const bi = iconv.decode(bBuffer, 'binary');
    const eucB = iconv.decode(bi, 'euc-kr');
    return iconv.encode(eucB, 'utf-8');
}

// ftp file 반환
const getObj = async function (ftpPath, encoded = 'utf8') {
    const stream = await ftp.get(ftpPath);
    if (encoded === 'utf8') {
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
    } else if (encoded === 'euc-kr') {
        return new Promise((resolve, reject) => {
            let bufs = '';
            stream.setEncoding('binary');
            stream.on('readable', function () {
                while (data = this.read()) {
                    // console.log('test');
                    bufs = bufs + data;
                }
            });
            stream.on('error', function(err) {
                reject(err);
            });
            stream.on('end', function() {
                const buf = Buffer.from(bufs, 'binary');
                const strData = convertEncoding(buf).toString();
                resolve(JSON.parse(strData));
            })
        });
    } else {
        throw new Error('not support encode type')
    }
}

const close = function () {
    return ftp.end();
}

const getObjOnce = async function (ftpPath, encoded = 'utf8') {
    await connect();
    const obj = await getObj(ftpPath, encoded);
    await close();
    return obj;
}

module.exports = {
    getModifyDate,
    connect,
    close,
    getList,
    getFile,
    getObj,
    putFile,
    getObjOnce,
}