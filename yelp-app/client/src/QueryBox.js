import React, { Component } from 'react';
import Choice from './Choice';

/**
 * Add this back later when I can handle closes...
 
 <button type="button" className="close removeQueryAttr" aria-label="Close">
<span aria-hidden="true">×</span>
</button>

 */

class QueryBox extends Component {
  render() {
    const formattedQueryAttributes = Object.keys(this.props.selectedQueryAttributes).map((category, index) =>
        <Choice>
            {`${category}: ` + this.props.selectedQueryAttributes[category]}
        </Choice>   
    );
    return (
      <div className="QueryBox">
        <ul style={{listStyleType: 'none', display: "inline"}}>
            {formattedQueryAttributes}
        </ul>
      </div>
    );
  }
}

export default QueryBox;