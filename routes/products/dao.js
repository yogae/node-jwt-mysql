const lowdb = require('../../lowdb');
// const Product = db.get('item');

/**
 * @typedef Product
 * @property {string} pn
 * @property {string} des
 * @property {string} des1
 * @property {string} kdes
 * @property {number} price
 * @property {string} p_date
 * @property {number} lev
 * @property {string} category
 * @property {string} supn
 * @property {string} brand
 * @property {string} series
 * @property {string} keyword
 * @property {string} origin
 * @property {number} psq
 * @property {number} ofq0
 * @property {number} ofq1
 * @property {string} deliv1
 * @property {integer} poq
 * @property {string} mstnote
 * @property {string} slnote
 * @property {string} img_ext
 * @property {string} pn_cat
 * @property {string} pn_a
 * @property {string} sspnt
 */

/**
 *
 * @property {item: object, cust: object} data
 * @class DbDao
 */
class ProductDao {
    
    /**
     *
     * product 생성
     * @param {Product} product
     * @returns
     * @memberof ProductDao
     */
    async insert (product) {
        return lowdb.getDb().get('item').insert(product).write();
    }

    /**
     *
     * product list 반환
     * @param {string} id
     * @memberof ProductDao
     */
    async getList () {
        return lowdb.getDb().get('item').value();
    }

    /**
     *
     * id의 product 반환
     * @param {string} id
     * @memberof ProductDao
     */
    async getById (id) {
        return lowdb.getDb().get('item').find({ id }).value();
    }

    /**
     *
     * id의 product 삭제
     * @param {string} id
     * @memberof ProductDao
     */
    async deleteById (id) {
        return lowdb.getDb().get('item').remove({ id }).write();
    }


    // /**
    //  *
    //  * prodoct db update
    //  * @param {*} productJson
    //  * @returns
    //  * @memberof ProductDao
    //  */
    // async updateDb (productJson) {
    //     await Product.query().truncate();
    //     const productUpdatePromises = productJson.map((product) => {
    //         return Product.query().insert(product);
    //     });
    //     const result = await Promise.all(productUpdatePromises);
    //     return result;
    // }
}

module.exports = new ProductDao();