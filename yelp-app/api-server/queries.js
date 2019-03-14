/**
 * Connection pooler for PostgreSQL. 
 */
const Pool = require('pg').Pool;

/**
 * Bad security practice, but this is just a prototype.
 */
const pool = new Pool({
    database: 'CraKeN_YelpDB',
    user: process.env.USER,
    host: 'localhost',
    password: '12345',
    port: 5432,
});

/**
 * Routes:
 *      GET -- /api/business        |   displayBusinesses()
 */

const displayBusinesses = (request, response) => {
    pool.query('SELECT DISTINCT business_name, business_city, business_state FROM business ORDER BY business_name', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
};

const displayDistinctStates = (request, response) => {
  pool.query('SELECT DISTINCT business_state FROM business ORDER BY business_state', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
    displayBusinesses,
    displayDistinctStates,
};