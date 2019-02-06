const baseurl = 'http://localhost:3000/';

// Initialize index
function start() {
    let stateDropdown = document.getElementById("stateDropdown"),
        cityDropdown = document.getElementById("cityDropdown");
        businessList = document.getElementById('businessList');

    stateDropdown.innerHTML = '';
    cityDropdown.innerHTML = '';
    businessList.innerHTML = ''; 

    getStates(); // Populate stateDropdown with states
    stateDropdown.onchange = getCitiesEvent; // Update cities when stateDropdown changes
    cityDropdown.onchange = getBusinessesEvent; // Update businesses when cityDropdown changes

 }

// Make GET request to recieve states and populate states
function getStates() {
    fetch(baseurl, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => populateStates(response))
    .catch(error => console.error('Error:', error));
}

// Populate State Dropdown with states
function populateStates(states) {
    let stateDropdown = document.getElementById("stateDropdown");
    stateDropdown.innerHTML = ''; // Delete Children
    console.log(states);

    for (let i = 0; i < states.length; i++) {
        let s = document.createElement('option');
        s.innerHTML = states[i].business_state;
        s.value = states[i].business_state;
        stateDropdown.appendChild(s);
    }
    document.getElementById("stateDropdown").selectedIndex = -1; // Default state is set to empty
}

// Make GET request to update cityDropdown after a state is selected
function getCitiesEvent(event) {
    let state = this.value;
    if (isEmpty(state))
        return;

    fetch(baseurl + state, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => populateCities(response))
    .catch(error => console.error('Error:', error));
}

// Populate City Dropdown with cities
function populateCities(cities) {
    let cityDropdown = document.getElementById("cityDropdown"),
        businessList = document.getElementById('businessList');

    cityDropdown.innerHTML = ''; // Delete Children
    businessList.innerHTML = ''; // Reset Business List
    console.log(cities);

    for (let i = 0; i < cities.length; i++) {
        let s = document.createElement('option');
        s.innerHTML = cities[i].business_city;
        s.value = cities[i].business_city;
        cityDropdown.appendChild(s);
    }
    document.getElementById("cityDropdown").selectedIndex = -1; // Default city is set to empty
}

// Make GET request to update businesses after cityDropdown changes
function getBusinessesEvent(event) {
    let city = this.value,
        state = document.getElementById("stateDropdown").value;

    if (isEmpty(city) || isEmpty(state))
        return;

    fetch(baseurl + state + '/' + city, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => populateBusinesses(response))
    .catch(error => console.error('Error:', error));
}

// Populate businesses
function populateBusinesses(businesses) {
    let businessList = document.getElementById('businessList');
    businessList.innerHTML = ''; // Delete Children

    console.log(businesses);

    for (let i = 0; i < businesses.length; i++) {
        let s = document.createElement('p');
        s.innerHTML = businesses[i].business_name;
        businessList.appendChild(s);
    }
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}