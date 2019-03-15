import React, { Component } from 'react';
import FilterSelector from './FilterSelector';
import FilterSelectorChoices from './FilterSelectorChoices';
import Client from './Client';

class QueryBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedCategory: '',
        selectedCategoryList: []
    }
  }

  fillFilterSelectorChoices(e) {
    var actualStateList = [];
    const selectedCategory = e.target.value;

    if (selectedCategory == "state") {
        Client.getBusinessStates((states) => {
            states.forEach(element => {
                actualStateList.push(element['business_state'])
            })
            this.setState({
                selectedCategory: selectedCategory,
                selectedCategoryList: actualStateList
            });
        });
    } else {
        this.setState({
            selectedCategory: selectedCategory,
            selectedCategoryList: []
        });
    }
  }
  render() {
    return (
        <div className="queryBuilder">
            <FilterSelector handleSelect={this.fillFilterSelectorChoices.bind(this)} />
            <FilterSelectorChoices selectedCategoryList={this.state.selectedCategoryList} />
        </div>
    );
  }
}

export default QueryBuilder;