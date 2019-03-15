import React, { Component } from 'react';

class FilterSelectorChoices extends Component {
  render() {
    const formattedList = this.props.selectedCategoryList.map((choice) =>
        <li>{choice}</li>
    );
    return (
      <div className="FilterSelectorChoices">
        <ul>{formattedList}</ul>
      </div>
    );
  }
}

export default FilterSelectorChoices;