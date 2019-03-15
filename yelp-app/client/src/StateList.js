import React, { Component } from 'react';
import Client from './Client';

class StateList extends Component {
  constructor(props) {
    super(props);
    this.state = { stateList: [] };
  }

  componentDidMount() {
    var actualStateList = [];

    Client.getBusinessStates((states) => {
        states.forEach(element => {
            actualStateList.push(element['business_state'])
        })
        this.setState({ stateList: actualStateList })
    });
  }

  render() {
    const formattedStateList = this.state.stateList.map((statename) =>
        <li>{statename}</li>
    );
    console.log(formattedStateList);
    return (
      <div className="StateList">
        <p>
        Businesses are located in the following locations:
        </p>
        <ul>{formattedStateList}</ul>
      </div>
    );
  }
}

export default StateList;