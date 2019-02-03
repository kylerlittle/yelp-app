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
const port = 3000;
const cors = require('cors')

app.use(cors()) 
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/**
 * Routes:
 *      GET -- /                |   displayStates()
 *      GET -- /:state          |   getCities()
 *      GET -- /:state/:city    |   getBusinesses()
 */

app.get('/', db.displayStates);
app.get('/:state', db.getCities);
app.get('/:state/:city', db.getBusinesses);

/**
 * List on port specified at top of file.
 */
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});