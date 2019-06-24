const { Model } = require('objection');
const Knex = require('knex');
// const User = require('./users');
// const Product = require('./products');
const user = process.env.DB_USER;
const dbUrl = process.env.DB_HOST;
const password = process.env.DB_PASSWORD;
const db = process.env.DB_NAME;

let dbDestroyed = true;

/**
 * @type {Knex}
 */
let knex;
async function connect () {
    if (dbDestroyed) {
        knex = Knex({
            client: 'mysql2',
            version: '5.7',
            connection: {
                host : dbUrl,
                user : user,
                password : password,
                database : db
            }
        });
        Model.knex(knex);
        dbDestroyed = false;
    }

    // await dropTable();
    if (await knex.schema.hasTable('users') && await knex.schema.hasTable('products')) {
      return;
    }
  
    // Create database schema. You should use knex migration files
    // to do this. We create it here for simplicity.
    await knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('name');
        table.string('email');
        table.string('password');
        table.string('hname');
        table.string('htel');
        table.string('lev');
    });

    await knex.schema.createTable('products', table => {
        table.increments('id').primary();
        table.string('pn');
        table.string('des');
        table.string('des1');
        table.string('kdes');
        table.integer('price');
        table.string('p_date');
        table.integer('lev');
        table.string('category');
        table.string('supn');
        table.string('brand');
        table.string('series');
        table.string('keyword');
        table.string('origin');
        table.integer('psq');
        table.integer('ofq0');
        table.integer('ofq1');
        table.string('deliv1');
        table.integer('poq');
        table.string('mstnote');
        table.string('slnote');
        table.string('img_ext');
        table.string('pn_cat');
        table.string('pn_a');
        table.string('sspnt');
    });
}

async function close () {
    dbDestroyed = true;
    return knex.destroy();
}

async function dropTable () {
    return knex.schema.dropTableIfExists('users')
            .dropTableIfExists('products');
}

module.exports = {
    connect,
    close,
    dropTable,
}
