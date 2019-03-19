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

function getBusinessStates(callback) {
  return fetch(`/api/states`, {
    accept: "application/json"
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(callback);
}

function searchBusinesses(query, callback) {
  const q = query;  // alias
  /**
   * const queryString = require('query-string');
   * var stringified = queryString.stringify(query)
   * // ensure empty set and empty string handled appropriately
   * return fetch(`api/business?${stringified}`, ...)
   */
  return fetch(`api/business?state=${q.state}`, {
    accept: "application/json"
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(callback);
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
  
  const Client = { searchBusinesses, getBusinessStates };
  export default Client;