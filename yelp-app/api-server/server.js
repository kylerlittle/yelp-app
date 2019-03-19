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
 * Routes:
 *      GET -- /api/businesses
 *          ==> accepts query parameters: state={}, city={}, zipcode={} 
 *          ==> Body of form {categories: ["...", "...", etc]}
 *      GET -- /api/states
 *      GET -- /api/states/:state/cities
 *      GET -- /api/states/:state/cities/:city/zipcodes
 *      GET -- /api/reviews/:businessID
 *      GET -- /api/states/:state/cities/:city/zipcodes/:zipcode/categories
 *      POST -- /api/reviews/:businessID
 *         ==> Body of form {user_id: "...", review_text: "", stars_given: 5}
 *         ==> Unique review_id should be generated
 */
app.get('/api/businesses', db.getBusinesses);
app.get('/api/states', db.getDistinctStates);
app.get('/api/states/:state/cities', db.getCities);
app.get('/api/states/:state/cities/:city/zipcodes', db.getZipcodes);
app.get('/api/reviews/:businessID', db.getReviews);
app.get('/api/states/:state/cities/:city/zipcodes/:zipcode/categories', db.getCategories);
app.post('/api/reviews/:businessID', db.postReview);

/**
 * List on port specified at top of file.
 */
app.listen(port, () => {
    console.log(`API Server for Yelp App running on port ${port}.`)
});
