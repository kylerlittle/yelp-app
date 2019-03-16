import React, { Component } from 'react';
import FilterSelector from './FilterSelector';
import FilterSelectorChoices from './FilterSelectorChoices';
import Client from './Client';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

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
        <Container fluid={true}>
        <Row>
            <Col>
            <FilterSelector handleSelect={this.fillFilterSelectorChoices.bind(this)} />
            <FilterSelectorChoices selectedCategoryList={this.state.selectedCategoryList} />
            </Col>
            <Col>Second Column</Col>
        </Row>
        </Container>
    );
  }
}

export default QueryBuilder;