const iconv = require('iconv-lite');
const fs = require('fs');

exports.euc2utfFromPath = function (filePath) {
    const eucBuffer = fs.readFileSync(filePath);
    const eucB = iconv.decode(eucBuffer, 'euc-kr');
    return iconv.encode(eucB, 'utf-8');
}

exports.euc2utfFromStr = function (jsonData) {
    const eucB = iconv.decode(Buffer.from(jsonData), 'euc-kr');
    return iconv.encode(eucB, 'utf-8');
}

