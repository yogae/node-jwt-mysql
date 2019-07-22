const User = require('../../models/users');

/**
 * @typedef User
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} hname
 * @property {number} htel
 * @property {string} lev
 * @property {string} role
 */

/**
 *
 * @property {item: object, cust: object} data
 * @class UserDao
 */
class UserDao {


    /**
     *
     * user 생성
     * @param {User} user
     * @returns
     * @memberof UserDao
     */
    async insert (user) {
        return User.query().insert(user);
    }

    /**
     *
     * user list 반환
     * @param {string} id
     * @memberof UserDao
     */
    getList () {
        return User.query();
    }

    /**
     *
     * id의 user 정보 반환
     * @param {string} id
     * @memberof UserDao
     */
    getById (id) {
        return User.query().findById(id);
    }

    
    /**
     *
     * name과 password로 user 정보 반환
     * @param {string} name
     * @param {string} password
     * @returns
     * @memberof UserDao
     */
    findUser (name, password) {
        return User.query().findOne({ name, password });
    }

    /**
     *
     * user 삭제
     * @param {string} id
     * @memberof UserDao
     */
    deleteById (id) {
        return User.query().deleteById(id);
    }


    /**
     *
     * user db update
     * @param {*} userJson
     * @returns
     * @memberof UserDao
     */
    async updateDb (userJson) {
        await User.query().truncate();
        const userUpdatePromises = userJson.map((user) => {
            return User.query().insert(user);
        });
        const result = await Promise.all(userUpdatePromises);
        return result;
    }
}

module.exports = new UserDao();