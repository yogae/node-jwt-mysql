const Product = require('../../models/products');

/**
 *
 * @property {item: object, cust: object} data
 * @class DbDao
 */
class ProductDao {

    async insert () {
        return Product.query().insert({firstName: 'qwe'});
    }

    /**
     *
     *
     * @param {string} id
     * @memberof ProductDao
     */
    async getList () {
        return Product.query();
    }

    /**
     *
     *
     * @param {string} id
     * @memberof ProductDao
     */
    async getById (id) {
        return Product.query().findById(id);
    }
}

module.exports = new ProductDao();