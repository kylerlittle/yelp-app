import React, { Component } from 'react';
import Choice from './Choice';

class QueryBox extends Component {
  render() {
    const formattedQueryAttributes = Object.keys(this.props.selectedQueryAttributes).map((category, index) =>
        <Choice> {`${category}: ` + this.props.selectedQueryAttributes[category]} </Choice>
    );
    return (
      <div className="QueryBox">
        <ul style={{listStyleType: 'none'}}>
            {formattedQueryAttributes}
        </ul>
      </div>
    );
  }
}

export default QueryBox;