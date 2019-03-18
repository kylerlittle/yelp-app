import React, { Component } from 'react';

class MatchingBusinesses extends Component {
  render() {
    const formattedList = this.props.matchingBusinesses.map((business) =>
        <li>{business}</li>
    );
    return (
        <ul className="MatchingBusinessesList">{formattedList}</ul>
    );
  }
}

export default MatchingBusinesses;