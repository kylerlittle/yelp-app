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
 *      GET -- /api/businesses
 *          ==> accepts query parameters: state={}, city={}, zipcode={}, categories={,} (comma-separated)
 *      GET -- /api/states
 *      GET -- /api/states/:state/cities
 *      GET -- /api/states/:state/cities/:city/zipcodes
 *      GET -- /api/reviews/:businessID
 *      GET -- /api/states/:state/cities/:city/zipcodes/:zipcode/categories
 *      POST -- /api/reviews/:businessID
 *         ==> Body of form {user_id: "...", review_text: "", stars_given: 5}
 *         ==> Unique review_id should be generated
 */

const getBusinesses = (request, response) => {
  const business_state = request.query['state'], business_city = request.query['city'], 
    zipcode = request.query['zipcode'];
  const query = {
    text: 'SELECT DISTINCT business.business_id, business_name, business_address, business_city, business_state FROM business, categories \
      WHERE business.business_id=categories.business_id and \
      (business_state=$1 or $1 is null) and \
      (business_city=$2 or $2 is null) and \
      (postal_code=$3 or $3 is null) \
      ORDER BY business_name',
    values: [business_state, business_city, zipcode],
  }
  // Get query params, if any.
  console.log(request.query);
  for (const key in request.query) {
    console.log(request.query[key])
  }

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const getDistinctStates = (request, response) => {
  pool.query('SELECT DISTINCT business_state FROM business ORDER BY business_state', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCities = (request, response) => {
  const business_state = request.params.state;
  const query = {
    text: 'SELECT DISTINCT business_city FROM business WHERE business_state=$1 ORDER BY business_city',
    values: [business_state],
  }
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getZipcodes = (request, response) => {
  const business_state = request.params.state, business_city = request.params.city;
  const query = {
    text: 'SELECT DISTINCT postal_code FROM business WHERE business_state=$1 and business_city=$2 \
      ORDER BY postal_code',
    values: [business_state, business_city],
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

const getCategories = (request, response) => {
  const business_state = request.params.state, business_city = request.params.city, zipcode = request.params.zipcode;
  const query = {
    text: 'SELECT DISTINCT category_name FROM business, categories \
      WHERE business.business_id=categories.business_id and \
        business_state=$1 and business_city=$2 and postal_code=$3 \
      ORDER BY category_name',
    values: [business_state, business_city, zipcode],
  }
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const postReview = (request, response) => {
  console.log(request.body);
  const business_id = request.params.businessID, user_id = request.body.user_id,
    review_text = request.body.review_text, stars_given = request.body.stars_given;
  const date = new Date().toISOString().split("T")[0];

  // TODO: generate unique review_id
  const review_id = ""; 

  const query = {
    text: 'INSERT INTO review (review_id, user_id, business_id, review_text, stars_given, date_written) \
      VALUES ($1, $2, $3, $4, $5, $6)',
    values: [review_id, user_id, business_id, review_text, stars_given, date],
  }
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json({status: "Review inserted successfully"});
  })
}

module.exports = {
  getBusinesses,
  getDistinctStates,
  getCities,
  getZipcodes,
  getReviews,
  getCategories,
  postReview,
};