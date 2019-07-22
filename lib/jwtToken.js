const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// token 생성 
// token 생성시 attribute에 name, role, email정보를 추가 합니다.
exports.getToken = function (name, role, email) {
    return jwt.sign({
        name,
        role,
        email
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
 * 권한을 check하는 middleware
 * token을 decoding하여 token의 role attribute을 확인합니다.
 * @param {string[] | string} acceptRoles
 * @returns
 */
function checkRole (acceptRoles) {
    const roles = [].concat(acceptRoles);
    return function (req, res, next) {
        const { authorization } = req.headers;
        try {
            const { role } = verify(authorization);
            // acceptRoles에 admin이 포함되어 있는 경우 token의 role attribute에 admin이 포함되어야 isValidReq 값이 true
            const isValidReq = roles.includes(role);
            // isValidReq true인 경우만 다음 로직을 실행합니다.
            if (isValidReq) next();
            // isValidReq false인 경우 catch문 실행
            else throw new Error();
        } catch (err) {
            // 권한 없음 error 반환
            const error = new Error('not authorized user');
            error.status = 401;
            next(error);
        }
    }
}

exports.checkAuthHeader = checkRole