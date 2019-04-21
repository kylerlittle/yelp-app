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
 * Define the attributes which for Meals
 * which the user can filter by from the frontend
 */
const mealAttributes = new Set(
  'breakfast', 
  'brunch',
  'dessert',
  'dinner',
  'lunch',
  'latenight',
);

/**
 * Define the attributes which the user can filter by
 * from the frontend
 */
const filterableAttributes = new Set(
  'BusinessAcceptsCreditCards', 
  'RestaurantsReservations',
  'WheelchairAccessible',
  'OutdoorSeating',
  'GoodForKids',
  'RestaurantsGoodForGroups',
  'RestaurantsDelivery',
  'RestaurantsTakeOut',
  'WiFi',
  'BikeParking',
);

function getCategoriesSQLString(queryObj)
{
  var categories;

  if (queryObj['categories']) {
    // Elements are comma-separated
    categories = queryObj['categories'].split(',');
    // Replace any '&amp;' with an '&'
    categories = categories.map((element) => element.replace(/&amp;/g, '&'));
  }
  
  let categoriesQuery = "";

  // Build filter-by-category portion of query
  if (categories instanceof Array) {

    for (i = 0, tok = ""; i < categories.length; i++){
      categoriesQuery += `${tok}lower(categories.category_name)=lower(\'${categories[i]}\')`;
      tok = " or ";
    }
  }

  return [categories, categoriesQuery];
}

function getAttributesSQLString(queryObj, attributeType)
{
  var attributes;

  if (queryObj[attributeType]) {
    // Elements are comma-separated
    attributes = queryObj[attributeType].split(',');
    // Replace any '&amp;' with an '&'
    attributes = attributes.map((element) => element.replace(/&amp;/g, '&'));
  }
  
  let attributesQuery = "";

  // Build filter-by-category portion of query
  if (attributes instanceof Array) {

    for (i = 0, tok = ""; i < attributes.length; i++){
      attributesQuery += `${tok}lower(attributes.attribute_name)=lower(\'${attributes[i]}\')`;
      // HACK > 'true' OR 'free' or 'paid'
      attributesQuery += ` and (attributes.attribute_value = \'true\' or attributes.attribute_value = \'free\' or attributes.attribute_value = \'paid\')`;
      tok = " or ";
    }
  }

  return [attributes, attributesQuery];
}

/**
 * 
 * @param {[string]} listOfQueryStrings 
 */
function groupQueryParamsThatAreListsWithOr(listOfQueryStrings)
{
  groupedQueries = "";

  for (i = 0, tok = ""; i < listOfQueryStrings.length; i++)
  {
    if (listOfQueryStrings[i] !== '') {
      groupedQueries += `${tok}${listOfQueryStrings[i]}`;
      tok = " or ";
    }
  }

  return (groupedQueries === '') ? "" : `(${groupedQueries})`;
}

/**
 * Return SQL query string S inside object { text: S }.
 * @param {state: '', city: '', zipcode: '', categories: []} queryObj 
 * @param {string} selection 
 * @param {string} orderBy 
 * @param {boolean} businessSearchFlag 
 */
function getSQLQuery(queryObj, selection, orderBy, businessSearchFlag)
{
  var result, categories, categoriesQuery, priceQuery, attributes,
    attributesQuery, meals, mealsQuery, allCatsFlag = false;

  // get categories portion of query
  if (queryObj['categories']) {
    if (queryObj['categories'] === 'all') {
      categoriesQuery = "";
      allCatsFlag = true;
    } else {
      result = getCategoriesSQLString(queryObj);
      categories = [...result[0]];
      categoriesQuery = result[1];
    }
  }

  // get price portion of query
  if (queryObj['price']) {
    priceQuery = (queryObj['price'] !== 'all') ? ' (attribute_name = \'RestaurantsPriceRange2\' and ' +
        'attribute_value = \'' + queryObj['price'] + '\')': ' (attribute_name = \'RestaurantsPriceRange2\')'
  } else {
    priceQuery = '';
  }

  // get meals portion of query
  if (queryObj['meals']) {
    if (queryObj['meals'] === 'all') {
      queryObj = {
        ...queryObj,
        'meals': 'breakfast,brunch,dessert,dinner,lunch,latenight',
      };
    }
    result = getAttributesSQLString(queryObj, 'meals');
    meals = [ ...result[0]];
    mealsQuery = result[1];
  } else {
    mealsQuery = '';
  }

  // get attributes portion of query
  if (queryObj['attributes']) {
    if (queryObj['attributes'] === 'all') {
      queryObj = {
        ...queryObj,
        'attributes': 'BusinessAcceptsCreditCards,RestaurantsReservations,WheelchairAccessible,' +
        'OutdoorSeating,GoodForKids,RestaurantsGoodForGroups,RestaurantsDelivery,' + 
        'RestaurantsTakeOut,WiFi,BikeParking',
      };
    }
    result = getAttributesSQLString(queryObj, 'attributes');
    attributes = [ ...result[0]];
    attributesQuery = result[1];
  } else {
    attributesQuery = '';
  }

  var attrGroupByClause = "", categoryGroupByClause = "", attrCountRequired = 0, categoryCountRequired = 0;

  if (businessSearchFlag) {
    // need a group by clause
    if (queryObj['meals'] || queryObj['attributes'] || queryObj['price'] || (categoriesQuery && orderBy !== 'category_name')) {
      attrGroupByClause += ' GROUP BY business.business_id, business_name, business_address, business_city, business_state, postal_code ';
      categoryGroupByClause = attrGroupByClause;

      if (queryObj['meals']) {
        attrCountRequired += meals.length;
      }

      if (queryObj['attributes']) {
        attrCountRequired += attributes.length;
      }

      if (queryObj['price']) {
        attrCountRequired += 1;
      }

      if (queryObj['attributes'] || queryObj['meals'] || queryObj['price']) {
        attrGroupByClause += `HAVING COUNT(*) = ${attrCountRequired}`
      }

      if (categoriesQuery && orderBy !== 'category_name') {
        categoryCountRequired += categories.length;
        categoryGroupByClause += `HAVING COUNT(*) = ${categoryCountRequired}`
      }
    }
  }

  var groupedAttributeQueryString = groupQueryParamsThatAreListsWithOr([attributesQuery, mealsQuery, priceQuery]);
  var groupedCategoryQueryString = groupQueryParamsThatAreListsWithOr([categoriesQuery]);

  const attributes_query = {
    text: `SELECT DISTINCT ${selection}\
      FROM business, attributes\
      WHERE business.business_id = attributes.business_id\
        ${(queryObj['state']) ? ' and business_state=UPPER(\'' + queryObj['state'] + '\')' : ''}\
        ${(queryObj['city']) ? ' and business_city=\'' + queryObj['city'] + '\'' : ''}\
        ${(queryObj['zipcode']) ? ' and postal_code=' + queryObj['zipcode'] : ''}\
        ${(groupedAttributeQueryString === '') ? "" : ' and ' + groupedAttributeQueryString}\
        ${attrGroupByClause}\
        ${(orderBy === '') ? '' : 'ORDER BY ' + orderBy}`,
  }

  const categories_query = {
    text: `SELECT DISTINCT ${selection}\
      FROM business, categories\
      WHERE business.business_id = categories.business_id\
        ${(queryObj['state']) ? ' and business_state=UPPER(\'' + queryObj['state'] + '\')' : ''}\
        ${(queryObj['city']) ? ' and business_city=\'' + queryObj['city'] + '\'' : ''}\
        ${(queryObj['zipcode']) ? ' and postal_code=' + queryObj['zipcode'] : ''}\
        ${(groupedCategoryQueryString === '') ? "" : ' and ' + groupedCategoryQueryString}\
        ${categoryGroupByClause}\
        ${(orderBy === '') ? '' : 'ORDER BY ' + orderBy}`,
  }

  console.log(`category query str: ${categoriesQuery}`)
  // Combine the two queries with a subquery
  if ((queryObj['attributes'] || queryObj['meals'] || queryObj['price']) && (categoriesQuery && orderBy !== 'category_name')) {
    return {
      text: `SELECT * FROM ${'(' + categories_query['text'] + ') as C INNER JOIN'}\
            ${'(' + attributes_query['text'] + ') as A ON C.business_id = A.business_id' }`
    };
  }
  // Dealing with a query with only attributes relation
  else if (categoriesQuery || allCatsFlag)
  {
    return categories_query;
  }
  // Dealing with a query with only categories relation
  else
  {
    return attributes_query;
  }
}

/**
 * Query Parameters that can describe a business:
 *    state="", city="", zip="", categories=["", ..., ""], price="", 
 *    meal=["", ..., ""], attribute=["", ..., ""]
 * 
 * In general, we allow for flexibility because from the user of the API's
 * perspective, querying for a given data type (i.e. states, cities) should
 * depend on what other search parameters have already been used. For instance,
 * if a user selects search parameters "city=Phoenix", and then goes to select
 * a state, the only state available should be "Arizona" in this database.
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
 *      GET -- /api/categories
 *      GET -- /api/prices
 *      GET -- /api/attributes
 *      GET -- /api/meals
 * 
 * 
 *      *** Review Viewing & Submitting ***
 *      GET -- /api/reviews/:businessID
 *      POST -- /api/reviews/:businessID
 *         ==> Body of form {user_id: "...", review_text: "", stars_given: 5}
 *         ==> Unique review_id should be generated
 */

const getBusinesses = (request, response) => {
  const query = getSQLQuery(request.query, 'business.business_id, business_name,\
   business_address, business_city, business_state, postal_code', 'business_name', true);
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const getStatesFlexible = (request, response) => {
  const query = getSQLQuery(request.query, 'business_state', 'business_state', false);
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCitiesFlexible = (request, response) => {
  const query = getSQLQuery(request.query, 'business_city', 'business_city', false);
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getZipcodesFlexible = (request, response) => {
  const query = getSQLQuery(request.query, 'postal_code', 'postal_code', false);
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCategories = (request, response) => {
  const query = {
    text: `SELECT DISTINCT category_name\
      FROM business, categories\
      WHERE business.business_id = categories.business_id\
        ${(request.query['state']) ? ' and business_state=UPPER(\'' + request.query['state'] + '\')' : ''}\
        ${(request.query['city']) ? ' and business_city=\'' + request.query['city'] + '\'' : ''}\
        ${(request.query['zipcode']) ? ' and postal_code=' + request.query['zipcode'] : ''}\
        ORDER BY category_name`,
  }
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCategoriesFlexible = (request, response) => {
  if (!request.query['categories']) request.query['categories'] = 'all';
  const query = getSQLQuery(request.query, 'category_name', 'category_name', false);
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPrices = (request, response) => {
  const query = {
    text: `SELECT DISTINCT attribute_value\
      FROM business, attributes\
      WHERE business.business_id = attributes.business_id\
        ${(request.query['state']) ? ' and business_state=UPPER(\'' + request.query['state'] + '\')' : ''}\
        ${(request.query['city']) ? ' and business_city=\'' + request.query['city'] + '\'' : ''}\
        ${(request.query['zipcode']) ? ' and postal_code=' + request.query['zipcode'] : ''}\
        and attribute_name = 'RestaurantsPriceRange2' ORDER BY attribute_value`,
  }
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPricesFlexible = (request, response) => {
  if (!request.query['price']) request.query['price'] = 'all';
  const query = getSQLQuery(request.query, 'attribute_value', 'attribute_value', false);
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAttributes = (request, response) => {
  let result, attributesQuery;
  var queryObj;
  queryObj = {
    'attributes': 'BusinessAcceptsCreditCards,RestaurantsReservations,WheelchairAccessible,' +
                  'OutdoorSeating,GoodForKids,RestaurantsGoodForGroups,RestaurantsDelivery,' + 
                  'RestaurantsTakeOut,WiFi,BikeParking',
  };
  result = getAttributesSQLString(queryObj, 'attributes');
  meals = [ ...result[0]];
  attributesQuery = result[1];

  const query = {
    text: `SELECT DISTINCT attribute_name\
      FROM attributes WHERE\
      ${attributesQuery}\
      ORDER BY attribute_name`,
  }
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAttributesFlexible = (request, response) => {
  if (!request.query['attributes']) request.query['attributes'] = 'all';
  const query = getSQLQuery(request.query, 'attribute_name', 'attribute_name', false);
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getMeals = (request, response) => {
  let result, mealsQuery;
  var queryObj;
  queryObj = {
    'meals': 'breakfast,brunch,dessert,dinner,lunch,latenight',
  };
  result = getAttributesSQLString(queryObj, 'meals');
  meals = [ ...result[0]];
  mealsQuery = result[1];

  const query = {
    text: `SELECT DISTINCT attribute_name\
      FROM attributes WHERE\
      ${mealsQuery}\
      ORDER BY attribute_name`,
  }
  console.log(query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getMealsFlexible = (request, response) => {
  if (!request.query['meals']) request.query['meals'] = 'all';
  const query = getSQLQuery(request.query, 'attribute_name', 'attribute_name', false);
  console.log(query)

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
  getCategories,
  getCategoriesFlexible,
  getPrices,
  getPricesFlexible,
  getAttributes,
  getAttributesFlexible,
  getMeals,
  getMealsFlexible,
  getReviews,
  postReview,
};


/*
*** TEST CASE ***
HRFJlSAP_EBU_MpPPmpUDQ
has...

RestaurantsTakeOut
BusinessAcceptsCreditCards
RestaurantsDelivery
NOT wifi

lunch
NOT dinner

pizza
restaurants
NOT beer

TODOs
- hardcode:
    - getMeals                ==> replace getMealsFlexible
    - getPricesFlexible       ==> ...
    - getCategoriesFlexible   ==> ...
    - getAttributesFlexible   ==> ...
- display more attributes on frontend
- sort attributes
    - pass in query parameter ==> sorted=sortingMethod

*/
