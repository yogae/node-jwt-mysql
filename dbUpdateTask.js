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
    if (userDocs) await updateUserDb(userDocs);
    if (producDocs) await updateProductDb(producDocs);
    await db.close();
}

async function isNeedUpdate () {
    let updateUser = false;
    let updateDb = false;
    const userModDate = await ftp.getModifyDate(userJsonPath);
    const dbModDate = await ftp.getModifyDate(dbJsonPath);
    if (fs.existsSync(versionPath)) {
        const versionStr = fs.readFileSync(versionPath);
        const versionDoc = JSON.parse(versionStr)
        updateUser = versionDoc.userDate !== userModDate;
        updateDb = versionDoc.dbDate !== dbModDate;
    } else {
        updateUser = true;
        updateDb = true;
    }
    return {
        user: updateUser,
        product: updateDb,
        versionDoc: {
            userDate: userModDate,
            dbDate: dbModDate,
        }
    }
}

function updateVersionFile(versionDoc) {
    console.log('version update');
    fs.writeFileSync(versionPath, JSON.stringify(versionDoc));
}

async function getFtpFiles (user, product) {
    let resUser;
    let resProduct;
    if (user) {
        const userDoc = await ftp.getObj(userJsonPath);
        resUser = userDoc.users;
    }
    if (product) {
        const productDoc = await ftp.getObj(dbJsonPath);
        resProduct = productDoc.item;
    }
    return {
        user: resUser,
        product: resProduct
    }
}

(async function main () {
    try {
        await ftp.connect();
        const { user, product, versionDoc} = await isNeedUpdate();
        const docs = await getFtpFiles(user, product);
        await dbUpdate(docs.user, docs.product);
        await ftp.close();
        if (user || product) updateVersionFile(versionDoc);
    } catch (error) {
        console.error('child process error:', error);
    }
    process.exit(1);
})();

process.on('message', function (msg) {
    if (msg === 'exit') process.exit(1);
})