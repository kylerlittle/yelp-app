import React, { Component } from 'react';
import Choice from './Choice';
import './MatchingBusinesses.css'

class MatchingBusinesses extends Component {
  render() {
    const formattedList = this.props.matchingBusinesses.map((business) =>
        <Choice handleClick={(e) => this.props.handleClick(e, business['id'])}>
        {business['name']}
        </Choice>
    );
    return (
        <ul className="MatchingBusinessesList">{formattedList}</ul>
    );
  }
}

export default MatchingBusinesses;