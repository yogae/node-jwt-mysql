const env = require('dotenv');
// env.config({ path: '/home/hosting_users/whaler/apps/whaler_whaler/.env' });
env.config({ path: `${__dirname}${process.env.NODE_ENV === 'local' ? '/.env.local' : '/.env'}`});
const db = require('./models');
const User = require('./models/users');
const lowdb = require('./lowdb');
// const Product = require('./models/products');
const ftp = require('./lib/ftp');
const fs = require('fs');

const dbJsonPath = process.env.FTP_DB_JSON_PATH;
const userJsonPath = process.env.FTP_USER_JSON_PATH;
const userVersionFilePath = process.env.USER_VERSION_FILE_PATH || 'version/user';
const dbVersionFilePath = process.env.DB_VERSION_FILE_PATH || 'version/db';

async function updateUserDb (userJson) {
    await db.connect();
    await User.query().truncate();
    const userUpdatePromises = userJson.map((user) => {
        return User.query().insert(user);
    });
    const res = await Promise.all(userUpdatePromises);
    await db.close();
    return res
}

async function updateProductDb (productJson, versionDate) {
    lowdb.writeDbJson(productJson);
    process.send(versionDate);
}

// async function updateProductDb (productJson) {
//     await Product.query().truncate();
//     const productUpdatePromises = productJson.map((product) => {
//         return Product.query().insert(product);
//     });
//     return await Promise.all(productUpdatePromises);
// }

function versionFile (versionFilePath, ftpDate) {
    let isNeedUpdate = false;
    if (fs.existsSync(versionFilePath)) {
        const versionStr = fs.readFileSync(versionFilePath).toString();
        isNeedUpdate = ftpDate !== Number.parseInt(versionStr);
    // version file이 없는 경우 update가 필요합니다.
    } else {
        isNeedUpdate = true;
    }
    return isNeedUpdate;
}

// version file을 확인하여 db update가 필요한지 확인
// update가 필요한 경우 true 반환하며 user와 product를 따로 관리합니다.
async function isNeedUpdate (ftpUserFilePath, ftpdbFilePath) {
    // ftp에서 db.json, users.json file의 수정시간을 가지고 옵니다.
    const userModDate = await ftp.getModifyDate(ftpUserFilePath);
    const dbModDate = await ftp.getModifyDate(ftpdbFilePath);
    // version file이 존재여부를 확인하고 있으면 수정시간을 확인합니다.
    // version file에 존재하는 수정시간이 ftp file의 수정시간과 같지 않은 경우 update가 필요합니다.
    const needUpdateUser = versionFile(userVersionFilePath, userModDate);
    const needUpdateDb = versionFile(dbVersionFilePath, dbModDate);
    return {
        user: needUpdateUser,
        product: needUpdateDb,
        versionDoc: {
            userDate: userModDate,
            dbDate: dbModDate,
        }
    }
}



function getFtpFiles (ftpUserFilePath, ftpdbFilePath) {
    return {
        user: async function () {
            const userDoc = await ftp.getObj(ftpUserFilePath, 'euc-kr');
            return userDoc.users;
        },
        product: async function () {
            const productDoc = await ftp.getObj(ftpdbFilePath, 'euc-kr');
            return productDoc;
        }
    }
}

// child process main 실행문
(async function main () {
    try {
        await ftp.connect();
        // user => update가 필요한 경우 true 반환
        // product => update가 필요한 경우 true 반환
        // versionDoc => 수정 시간 반환
        const { user, product, versionDoc } = await isNeedUpdate(userJsonPath, dbJsonPath);
        // 매개변수 user가 true인 경우 docs.user에 user.json 정보 반환, user가 false인 경우 docs.user undefined 반환
        // 매개변수 product가 true인 경우 docs.product에 product.json 정보 반환, , product가 false인 경우 docs.product undefined 반환
        const ftpFile = getFtpFiles(userJsonPath, dbJsonPath);
        if (user) {
            const userData = await ftpFile.user();
            await updateUserDb(userData);
            fs.writeFileSync(userVersionFilePath, versionDoc.userDate);
            console.log('user version update');
        }

        if (product) {
            const productDocs = await ftpFile.product()
            await updateProductDb(productDocs, versionDoc.dbDate);
        }
        await ftp.close();
    } catch (error) {
        // error 발생
        console.error('child process error:', error);
    }
    // process 종료
    process.exit(1);
})();

process.on('message', function (msg) {
    if (msg === 'exit') process.exit(1);
})