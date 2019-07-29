const env = require('dotenv');
// env.config({ path: '/home/hosting_users/whaler/apps/whaler_whaler/.env' });
env.config({ path: __dirname + '/.env' });
const db = require('./models');
const User = require('./models/users');
const Product = require('./models/products');
const ftp = require('./lib/ftp');
const fs = require('fs');

const dbJsonPath = process.env.FTP_DB_JSON_PATH;
const userJsonPath = process.env.FTP_USER_JSON_PATH;
const versionFilePath = process.env.VERSION_FILE_PATH || 'version';
const versionPath = __dirname + `/${versionFilePath}`;

async function updateUserDb (userJson) {
    await User.query().truncate();
    const userUpdatePromises = userJson.map((user) => {
        return User.query().insert(user);
    });
    return await Promise.all(userUpdatePromises);
}

async function updateProductDb (productJson) {
    await Product.query().truncate();
    const productUpdatePromises = productJson.map((product) => {
        return Product.query().insert(product);
    });
    return await Promise.all(productUpdatePromises);
}

async function dbUpdate (userDocs, producDocs) {
    await db.connect();
    // userDocs가 undefined가 아닌 경우 db update
    if (userDocs) await updateUserDb(userDocs);
    // producDocs가 undefined가 아닌 경우 db update
    if (producDocs) await updateProductDb(producDocs);
    await db.close();
}

// version file을 확인하여 db update가 필요한지 확인
// update가 필요한 경우 true 반환하며 user와 product를 따로 관리합니다.
async function isNeedUpdate () {
    let updateUser = false;
    let updateDb = false;
    // ftp에서 db.json, users.json file의 수정시간을 가지고 옵니다.
    const userModDate = await ftp.getModifyDate(userJsonPath);
    const dbModDate = await ftp.getModifyDate(dbJsonPath);
    // version file이 존재여부를 확인하고 있으면 수정시간을 확인합니다.
    // version file에 존재하는 수정시간이 ftp file의 수정시간과 같지 않은 경우 update가 필요합니다.
    if (fs.existsSync(versionPath)) {
        const versionStr = fs.readFileSync(versionPath);
        const versionDoc = JSON.parse(versionStr);
        updateUser = versionDoc.userDate !== userModDate;
        updateDb = versionDoc.dbDate !== dbModDate;
    // version file이 없는 경우 update가 필요합니다.
    } else {
        updateUser = true;
        updateDb = true;
    }
    return {
        user: updateUser,
        product: updateDb,
        // 서정된 시간 반환
        versionDoc: {
            userDate: userModDate,
            dbDate: dbModDate,
        }
    }
}


/**
 *
 * version file을 생성
 * @param {*} versionDoc
 */
function updateVersionFile(versionDoc) {
    console.log('version update');
    fs.writeFileSync(versionPath, JSON.stringify(versionDoc));
}


async function getFtpFiles (user, product) {
    let resUser;
    let resProduct;
    if (user) {
        const userDoc = await ftp.getObj(userJsonPath, 'euc-kr');
        resUser = userDoc.users;
    }
    if (product) {
        const productDoc = await ftp.getObj(dbJsonPath, 'euc-kr');
        resProduct = productDoc.item;
    }
    return {
        user: resUser,
        product: resProduct
    }
}

// child process main 실행문
(async function main () {
    try {
        await ftp.connect();
        // user => update가 필요한 경우 true 반환
        // product => update가 필요한 경우 true 반환
        // versionDoc => 수정 시간 반환
        const { user, product, versionDoc } = await isNeedUpdate();
        // 매개변수 user가 true인 경우 docs.user에 user.json 정보 반환, user가 false인 경우 docs.user undefined 반환
        // 매개변수 product가 true인 경우 docs.product에 product.json 정보 반환, , product가 false인 경우 docs.product undefined 반환
        const docs = await getFtpFiles(user, product);
        // docs.user, docs.product 중 undefined가 아닌 정보 update
        await dbUpdate(docs.user, docs.product);
        await ftp.close();
        if (user || product) updateVersionFile(versionDoc);
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