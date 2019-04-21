import React, { Component } from 'react';
import './FilterSelector.css';

class FilterSelector extends Component {
  render() {
    return (
        <select className="FilterSelector" onChange={this.props.handleSelect}>
            <option value="state">State</option>
            <option value="city">City</option>
            <option value="zipcode">ZIP Code</option>
            <option value="price">Price</option>
            <option value="categories">Restaurant Category</option>
            <option value="attributes">Restaurant Attributes</option>
            <option value="meals">Meals</option>
        </select>
    );
  }
}

export default FilterSelector;