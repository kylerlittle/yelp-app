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

function getBusinessStates(callback) {
  return fetch(`/api/states`, {
    accept: "application/json"
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(callback);
}

function searchBusinesses(query, callback) {
  /**
   * Convert any falsy values (or empty set) to undefined so stringify handles
   * it correctly.
   */
  const modifiedQuery = { ...query };
  for (let key in query) {
    if (!query[key] || (query[key] instanceof Set && query[key].size <= 0)) {
      modifiedQuery[key] = undefined;
    }
  }
  const stringified = queryString.stringify(modifiedQuery)

  return fetch(`api/businesses?${stringified}`, {
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