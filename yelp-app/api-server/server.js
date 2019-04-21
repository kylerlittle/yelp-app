const express = require('express');
/**
 * This module gives us some middleware for parsing incoming requests.
 * Link: https://www.npmjs.com/package/body-parser
 */
const bodyParser = require('body-parser');
/**
 * Use Express as our framework
 */
const app = express();
const db = require('./queries');
const port = 3001;
const cors = require('cors');

app.use(cors()); 
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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
app.get('/api/businesses', db.getBusinesses);
app.get('/api/states', db.getStatesFlexible);
app.get('/api/cities', db.getCitiesFlexible);
app.get('/api/zipcodes', db.getZipcodesFlexible);
app.get('/api/categories', db.getCategories);
app.get('/api/prices', db.getPrices);
app.get('/api/attributes', db.getAttributes);
app.get('/api/meals', db.getMeals);
app.get('/api/reviews/:businessID', db.getReviews);
app.post('/api/reviews/:businessID', db.postReview);

/**
 * List on port specified at top of file.
 */
app.listen(port, () => {
    console.log(`API Server for Yelp App running on port ${port}.`)
});
