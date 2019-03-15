import React, { Component } from 'react';

class FilterSelector extends Component {
  render() {
    return (
      <div className="FilterSelector">
        <select onChange={this.props.handleSelect}>
            <option value="state">State</option>
            <option value="city">City</option>
            <option value="zipcode">ZIP Code</option>
            <option value="categories">Restaurant Category</option>
        </select>
      </div>
    );
  }
}

export default FilterSelector;