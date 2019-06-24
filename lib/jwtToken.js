const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;

exports.getToken = function (role) {
    return jwt.sign({
        role,
    }, jwtSecretKey);
}

/**
 * 
 * @typedef VerifyObj
 * @property {string} role
 * @property {number} iat
 */

/**
 *
 *
 * @param {string} token
 * @returns {VerifyObj}
 */
function verify (token) {
    return jwt.verify(token, jwtSecretKey);
}
exports.verify = verify;

exports.decode = function (token) {
    return jwt.decode(token);
}

/**
 *
 *
 * @param {string[] | string} acceptRoles
 * @returns
 */
function checkRole (acceptRoles) {
    const roles = [].concat(acceptRoles);
    return function (req, res, next) {
        const { authorization } = req.headers;
        let role;
        try {
            role = verify(authorization);
        } catch (err) {
            next(err);
        }
        const isValidReq = roles.includes(role);
        if (isValidReq) next();
        else next(new Error(`invalid token: not authorized`))
    }
}

exports.checkAuthHeader = checkRole