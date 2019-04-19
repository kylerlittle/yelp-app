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
 * Generate random strings. 
 */
const crypto = require("crypto");

function getCategoriesSQLString(queryObj)
{
  var categories;

  if (queryObj['categories']) {
    // Elements are comma-separated
    categories = queryObj['categories'].split(',');
    // Replace any '&amp;' with an '&'
    categories = categories.map((element) => element.replace(/&amp;/g, '&'));
  }
  
  let query_portion = "";

  // Build filter-by-category portion of query
  if (categories instanceof Array) {

    for (i = 0, tok = ""; i < categories.length; i++){
      query_portion += `${tok}lower(categories.category_name)=lower(\'${categories[i]}\')`;
      tok = " or ";
    }
    query_portion = `(${query_portion})`;
  }

  return [categories, query_portion];
}

/**
 * Query Parameters that can describe a business:
 *    state="", city="", zip="", categories=["", ..., ""], price="", 
 *    meal=["", ..., ""], attribute=["", ..., ""]
 * 
 *
 * Routes:
 * 
 *      *** Business Search URI ***
 *      GET -- /api/businesses?querystring
 *          ==> Accepts query parameters: state="...", city="...", zipcode="..."
 *          ==> and categories=["...", "...", ..., "..."]
 * 
 * 
 *      *** Filters for Business Search ***
 *      GET -- /api/states?querystring
 *          ==> Select distinct states that match query string
 *          ==> Accepts city, zipcode, categories
 *      GET -- /api/cities?querystring
 *          ==> Select distinct cities that match query string
 *          ==> Accepts state, zipcode, categories
 *      GET -- /api/zipcodes?querystring
 *          ==> Select distinct zipcodes that match query string
 *          ==> Accepts state, city, categories
 * 
 * 
 *      *** Review Viewing & Submitting ***
 *      GET -- /api/reviews/:businessID
 *      POST -- /api/reviews/:businessID
 *         ==> Body of form {user_id: "...", review_text: "", stars_given: 5}
 *         ==> Unique review_id should be generated
 */

const getBusinesses = (request, response) => {
  var categories, result, query_portion;

  result = getCategoriesSQLString(request.query);
  categories = result[0];
  query_portion = result[1];

  const query = {
    text: `SELECT DISTINCT business.business_id, business_name, business_address, business_city, business_state, postal_code \
      FROM business, categories \
      WHERE business.business_id=categories.business_id\
        ${(request.query['state']) ? ' and business_state=UPPER(\'' + request.query['state'] + '\')' : ''}\
        ${(request.query['city']) ? ' and business_city=\'' + request.query['city'] + '\'' : ''}\
        ${(request.query['zipcode']) ? ' and postal_code=' + request.query['zipcode'] : ''}\
        ${(query_portion) ? ' and ' + query_portion + ' GROUP BY business.business_id, business_name, business_address, business_city, business_state \
        HAVING COUNT (*) >= ' + categories.length: ''}\
        ORDER BY business_name`,
  }

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const getStatesFlexible = (request, response) => {
  var categories, result, query_portion;

  result = getCategoriesSQLString(request.query);
  categories = result[0];
  query_portion = result[1];

  const query = {
    text: `SELECT DISTINCT business_state FROM business, categories\
    WHERE business.business_id=categories.business_id\
    ${(request.query['city']) ? 'and business_city = \'' + request.query['city'] + '\'' : ''} \
    ${(request.query['zipcode']) ? 'and postal_code = \'' + request.query['zipcode'] + '\'' : ''} \
    ${(query_portion) ? ' and ' + query_portion + ' GROUP BY business.business_id, business_name, business_address, business_city, business_state \
    HAVING COUNT (*) >= ' + categories.length: ''}
    ORDER BY business_state`,
  }

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCitiesFlexible = (request, response) => {
  var categories, result, query_portion;

  result = getCategoriesSQLString(request.query);
  categories = result[0];
  query_portion = result[1];

  const query = {
    text: `SELECT DISTINCT business_city FROM business, categories\
    WHERE business.business_id=categories.business_id\
    ${(request.query['state']) ? 'and business_state = UPPER(\'' + request.query['state'] + '\')' : ''}\
    ${(request.query['zipcode']) ? 'and postal_code = \'' + request.query['zipcode'] + '\'' : ''}\
    ${(query_portion) ? ' and ' + query_portion + ' GROUP BY business.business_id, business_name, ' +
    'business_address, business_city, business_state HAVING COUNT (*) >= ' + categories.length : ''}\
    ORDER BY business_city`,
  }

  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getZipcodesFlexible = (request, response) => {
  var categories, result, query_portion;

  result = getCategoriesSQLString(request.query);
  categories = result[0];
  query_portion = result[1];

  const query = {
    text: `SELECT DISTINCT postal_code FROM business, categories\
    WHERE business.business_id=categories.business_id\
    ${(request.query['state']) ? 'and business_state = UPPER(\'' + request.query['state'] + '\')' : ''}\
    ${(request.query['city']) ? 'and business_city = \'' + request.query['city'] + '\'' : ''}\
    ${(query_portion) ? ' and ' + query_portion + ' GROUP BY business.business_id, business_name, ' +
    'business_address, business_city, business_state HAVING COUNT (*) >= ' + categories.length : ''}\
    ORDER BY postal_code`,
  }

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCategoriesFlexible = (request, response) => {
  const query = {
    text: `SELECT DISTINCT category_name FROM business, categories\
    WHERE business.business_id=categories.business_id\
    ${(request.query['state']) ? 'and business_state = UPPER(\'' + request.query['state'] + '\')' : ''}\
    ${(request.query['city']) ? 'and business_city = \'' + request.query['city'] + '\'' : ''}\
    ${(request.query['zipcode']) ? 'and postal_code = \'' + request.query['zipcode'] + '\'' : ''} \
    ORDER BY category_name`,
  }

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getReviews = (request, response) => {
  const business_id = request.params.businessID;
  const query = {
    text: 'SELECT yelpuser.user_name, business.business_name, review.date_written, review.review_text, review.stars_given \
      FROM review, yelpuser, business \
      WHERE review.business_id=$1 and review.user_id=yelpuser.user_id and review.business_id=business.business_id \
      ORDER BY review.date_written',
    values: [business_id],
  }
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const postReview = (request, response) => {
  const business_id = request.params.businessID, user_id = request.body.user_id,
    review_text = request.body.review_text, stars_given = request.body.stars_given;
  const date = new Date().toISOString().split("T")[0];
  const review_id = crypto.randomBytes(11).toString('hex');
  console.log(`review_id: ${review_id}`);

  const query = {
    text: 'INSERT INTO review (review_id, user_id, business_id, review_text, stars_given, date_written) \
      VALUES ($1, $2, $3, $4, $5, $6)',
    values: [review_id, user_id, business_id, review_text, stars_given, date],
  }
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    else{
      response.status(200).json({status: "Review inserted successfully"});
    }
  })
}

module.exports = {
  getBusinesses,
  getStatesFlexible,
  getCitiesFlexible,
  getZipcodesFlexible,
  getCategoriesFlexible,
  getReviews,
  postReview,
};