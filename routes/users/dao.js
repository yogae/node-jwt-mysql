const User = require('../../models/users');

/**
 *
 * @property {item: object, cust: object} data
 * @class UserDao
 */
class UserDao {

    async insert () {
        return User.query().insert({ firstName: 'qwe'});
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
}

module.exports = new UserDao();