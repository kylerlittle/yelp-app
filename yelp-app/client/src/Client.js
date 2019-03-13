/*
 * Use this file to write queries to API Server backend. 
 * Can then utilize Client object in other files to search.
 */

function searchBusinesses(query, cb) {
    return fetch(`api/business?q=${query}`, {
      accept: "application/json"
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(cb);
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
  
  const Client = { search };
  export default Client;