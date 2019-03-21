import React, { Component } from 'react';
import './FilterSelector.css';

class FilterSelector extends Component {
  render() {
    return (
        <select className="FilterSelector" onChange={this.props.handleSelect}>
            <option value="state">State</option>
            <option value="city">City</option>
            <option value="zipcode">ZIP Code</option>
            <option value="categories">Restaurant Category</option>
        </select>
    );
  }
}

export default FilterSelector;