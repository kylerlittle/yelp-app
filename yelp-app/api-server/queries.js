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

/**
 * Routes:
 *      GET -- /api/businesses
 *          ==> accepts query parameters: state={}, city={}, zipcode={} 
 *          ==> Body of form {categories: ["...", "...", etc]}
 *      GET -- /api/states
 *      GET -- /api/states/:state/cities
 *          ==> state='all' returns all cities
 *      GET -- /api/states/:state/cities/:city/zipcodes
 *      GET -- /api/reviews/:businessID
 *      GET -- /api/states/:state/cities/:city/zipcodes/:zipcode/categories
 *      POST -- /api/reviews/:businessID
 *         ==> Body of form {user_id: "...", review_text: "", stars_given: 5}
 *         ==> Unique review_id should be generated
 *      GET -- /api/users/:userID
 *      GET -- /api/friends/:userID
 *      GET -- /api/friendsreviews/:userID
 *      DELETE -- /api/favorite/:businessID/user/:userID
 */

const getBusinesses = (request, response) => {
  const business_state = request.query['state'], business_city = request.query['city'], 
    zipcode = request.query['zipcode'];
  var categories;

  if (request.query['categories']) {
    // Elements are comma-separated
    categories = request.query['categories'].split(',');
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

  const query = {
    text: `SELECT DISTINCT business.business_id, business_name, business_address, business_city, business_state \
      FROM business, categories \
      WHERE business.business_id=categories.business_id\
        ${(business_state) ? ' and business_state=UPPER(\'' + business_state + '\')' : ''}\
        ${(business_city) ? ' and business_city=\'' + business_city + '\'' : ''}\
        ${(zipcode) ? ' and postal_code=' + zipcode : ''}\
        ${(query_portion) ? ' and ' + query_portion + ' GROUP BY business.business_id, business_name, business_address, business_city, business_state \
        HAVING COUNT (*) >= ' + categories.length: ''}\
        ORDER BY business_name`,
  }

  console.log(query);

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
  let query;

  // Return all cities
  if (business_state === "all"){
    query = {
      text: 'SELECT DISTINCT business_city FROM business ORDER BY business_city',
      values: [],
    }
  }
  // Return cities for only a single state
  else{
    query = {
      text: 'SELECT DISTINCT business_city FROM business WHERE business_state=$1 ORDER BY business_city',
      values: [business_state],
    }
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

const getUser = (request, response) => {
  const user_id = request.params.userID;
  const query = {
    text: 'SELECT * \
      FROM yelpuser \
      WHERE user_id=$1',
    values: [user_id],
  };
  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

const getFriends = (request, response) => {
  const user_id = request.params.userID;
  const query = {
    text: 'SELECT * \
      FROM yelpuser, friendswith \
      WHERE friendswith.owner_of_friend_list=$1 and \
            friendswith.on_friend_list=yelpuser.user_id',
    values: [user_id],
  };
  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

/* Get most recent review of each friend */
const getFriendsReviews = (request, response) => {
  const user_id = request.params.userID;
  const query = {
    text: 'SELECT U.user_id, U.user_name, B.business_name, R.business_id, \
                  R.review_id, R.cool, R.funny, R.useful, \
                  R.stars_given, R.date_written, R.review_text \
          FROM friendswith as FW, review as R, yelpuser as U, business as B \
          WHERE FW.owner_of_friend_list=$1 and \
                FW.on_friend_list=R.user_id and \
                R.user_id = U.user_id and \
                R.business_id = B.business_id and \
                R.date_written >= \
                  (SELECT MAX(R2.date_written) \
                  FROM review as R2 \
                  WHERE R2.user_id=R.user_id)',
    values: [user_id],
  };
  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

/* Delete business from user's favorites list */
const deleteFavoriteBusiness = (request, response) => {
  const user_id = request.params.userID;
  const business_id = request.params.businessID;
  const query = {
    text: 'DELETE FROM favorite \
           WHERE user_id=$1 and business_id=$2',
    values: [user_id, business_id],
  };
  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json({status: 'Delete successful!',});
  });
}

module.exports = {
  getBusinesses,
  getDistinctStates,
  getCities,
  getZipcodes,
  getReviews,
  getCategories,
  postReview,
  getUser,
  getFriends,
  getFriendsReviews,
  deleteFavoriteBusiness
};