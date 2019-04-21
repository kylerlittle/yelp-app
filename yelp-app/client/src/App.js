import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import BusinessSearch from './BusinessSearch';
import UserPageModal from './userpage/UserPageModal';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id : 'om5ZiponkpRqUNa3pVPiRg',
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Team CraKeN's Yelp App</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <BusinessSearch/>
        <UserPageModal/>
      </div>
    );
  }
}

export default App;
