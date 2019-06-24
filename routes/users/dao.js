const User = require('../../models/users');

/**
 * @typedef User
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} hname
 * @property {number} htel
 * @property {string} lev
 */

/**
 *
 * @property {item: object, cust: object} data
 * @class UserDao
 */
class UserDao {


    /**
     *
     *
     * @param {User} user
     * @returns
     * @memberof UserDao
     */
    async insert (user) {
        return User.query().insert(user);
    }

    /**
     *
     *
     * @param {string} id
     * @memberof UserDao
     */
    getList () {
        return User.query();
    }

    /**
     *
     *
     * @param {string} id
     * @memberof UserDao
     */
    getById (id) {
        return User.query().findById(id);
    }

        /**
     *
     *
     * @param {string} id
     * @memberof UserDao
     */
    deleteById (id) {
        return User.query().deleteById(id);
    }
}

module.exports = new UserDao();