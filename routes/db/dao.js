const db = require('../../data/db.json');

/**  
  * @typedef {object} Data  
  */  

/**
 *
 * @property {item: object, cust: object} data
 * @class DbDao
 */
class DbDao {
    constructor (data) {
        this.data = data;
    }

    /**
     *
     *
     * @param {string} id
     * @memberof DbDao
     */
    getList () {
        return this.data.item;
    }

    /**
     *
     *
     * @param {string} id
     * @memberof DbDao
     */
    getById (id) {
        return this.data.item.filter((low) => low.id === id)[0];
    }
}

module.exports = new DbDao(db);