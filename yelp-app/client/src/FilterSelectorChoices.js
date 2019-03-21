import React, { Component } from 'react';
import Choice from './Choice';
import './FilterSelectorChoices.css';

class FilterSelectorChoices extends Component {
  render() {
    const formattedList = this.props.selectedCategoryList.map((choice) =>
        <Choice handleClick={this.props.handleClick}>
            {choice}
        </Choice>
    );
    return (
        <ul className="FilterSelectorChoiceList">{formattedList}</ul>
    );
  }
}

export default FilterSelectorChoices;