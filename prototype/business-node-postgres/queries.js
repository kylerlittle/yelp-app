/**
 * Connection pooler for PostgreSQL. 
 */
const Pool = require('pg').Pool;

/**
 * Bad security practice, but this is just a prototype.
 */
const pool = new Pool({
    database: 'Milestone1DB',
    user: process.env.USER,
    host: 'localhost',
    password: '12345',
    port: 5432,
});

/**
 * Routes:
 *      GET -- /                |   displayStates()
 *      GET -- /:state          |   getCities()
 *      GET -- /:state/:city    |   getBusinesses()
 */

const displayStates = (request, response) => {
    pool.query('SELECT DISTINCT business_state FROM business ORDER BY business_state', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
};

const getCities = (request, response) => {
    const business_state = request.params.state;

    pool.query('SELECT DISTINCT business_city FROM business WHERE business_state=$1 ORDER BY business_city', [business_state],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
};

const getBusinesses = (request, response) => {
    const business_state = request.params.state;
    const business_city = request.params.city;

    pool.query('SELECT business_name FROM business WHERE business_city=$1 \
        AND business_state=$2 ORDER BY business_name', [business_city, business_state],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
};

module.exports = {
    displayStates,
    getCities,
    getBusinesses,
};