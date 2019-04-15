import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import BusinessSearch from './BusinessSearch';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Team CraKeN's Yelp App</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <BusinessSearch />
      </div>
    );
  }
}

export default App;
