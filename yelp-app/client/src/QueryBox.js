import React, { Component } from 'react';
import Choice from './Choice';

class QueryBox extends Component {
  render() {
    const formattedQueryAttributes = this.props.selectedQueryAttributes.map((listItem) =>
        <Choice> {listItem} </Choice>
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