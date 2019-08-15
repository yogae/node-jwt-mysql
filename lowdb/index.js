const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');
const ftp = require('../lib/ftp');
const utfDBPath = 'data/utfDB.json';
let db;

function changeDb () {
    console.log('init DB');
    const adapter = new FileSync(utfDBPath);
    db = low(adapter);
    db._.mixin({
        insert: function (collection, doc) {
            const size = collection.length;
            const lastIndex = size - 1;
            const lastDocID = collection[lastIndex].id;
            collection.push(Object.assign(doc, {id: lastDocID + 1}));
            return doc;
        }
    });
}

module.exports = {
    getDb: function () {
        return db;
    },
    writeDbJson: function (dbJson) {
        fs.writeFileSync(utfDBPath, JSON.stringify(dbJson));
    },
    changeDb,
};
