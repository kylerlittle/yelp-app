/*
 * Use this file to write queries to API Server backend. 
 * Can then utilize Client object in other files to search.
 * 
 * In general, pass a callback function to these functions, which
 * will be executed once the promise is resolved. These callbacks
 * should set the state/props of whatever Component you're in to
 * cause a re-render.
 * 
 * Add function to export of Client object at bottom of file.
 */

 import queryString from 'query-string';

 function getSelectedQueryAttributeWithQueryString(selectedAttribute, query, callback) {
  /**
   * Convert any falsy values (or empty array -- which is truthy) to undefined so stringify handles
   * it correctly.
   */
  const modifiedQuery = { ...query };
  for (let key in query) {
    if ((query[key] instanceof Array && query[key].length < 1) || !query[key]) {
      modifiedQuery[key] = undefined;
    }
  }

  const stringified = queryString.stringify(modifiedQuery, {arrayFormat: 'comma'})

  return fetch(`api/${selectedAttribute + '?' + stringified}`, {
    accept: "application/json"
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(callback);
}

function getSelectedBusinessReviews(id, callback) {
  return fetch(`/api/reviews/${id}`, {
    accept: "application/json"
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(callback);
}

function searchBusinesses(query, callback) {
  /**
   * Convert any falsy values (or empty array -- which is truthy) to undefined so stringify handles
   * it correctly.
   */
  const modifiedQuery = { ...query };
  for (let key in query) {
    if ((query[key] instanceof Array && query[key].length < 1) || !query[key]) {
      modifiedQuery[key] = undefined;
    }
  }

  const stringified = queryString.stringify(modifiedQuery, {arrayFormat: 'comma'})

  return fetch(`api/businesses?${stringified}`, {
    accept: "application/json"
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(callback);
}

function postReview(businessID, review_info, callback) {
  return fetch(`api/reviews/${businessID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(review_info),
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(callback)
}
  
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}
  
function parseJSON(response) {
  return response.json();
}
  
const Client = {
  getSelectedQueryAttributeWithQueryString,
  getSelectedBusinessReviews,
  searchBusinesses,
  postReview,
};
export default Client;
