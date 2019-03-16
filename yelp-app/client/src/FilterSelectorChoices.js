import React, { Component } from 'react';
import Choice from './Choice';
import './FilterSelectorChoices.css';

class FilterSelectorChoices extends Component {
  render() {
    const formattedList = this.props.selectedCategoryList.map((choice) =>
        <Choice>{choice}</Choice>
    );
    return (
      <div>
        <ul className="FilterSelectorChoiceList">{formattedList}</ul>
      </div>
    );
  }
}

export default FilterSelectorChoices;