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
 *      GET -- /api/business?state={}&city={}&zipcode={}&business={}
 *      GET -- /api/states
 */
app.get('/api/business', db.displayBusinesses);
app.get('/api/states', db.displayDistinctStates);

/**
 * List on port specified at top of file.
 */
app.listen(port, () => {
    console.log(`API Server for Yelp App running on port ${port}.`)
});
