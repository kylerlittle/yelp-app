import React, { Component } from 'react';
import FilterSelector from './FilterSelector';
import FilterSelectorChoices from './FilterSelectorChoices';
import Client from './Client';
import QueryBox from './QueryBox';
import MatchingBusinesses from './MatchingBusinesses';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

class QueryBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedCategory: '',
        selectedCategoryList: [],
        selectedQueryAttributes: {
            state: '',
            city: '',
            zipcode: '',
            categories: new Set(),
        },
        matchingBusinesses: [],
    }
  }

  componentDidMount() {
    /**
     * Assume initial selection of category is 'state'. When component mounts,
     * update the selectedCategoryList with the stateList retrieved from backend.
     */
    var actualStateList = [];

    Client.getBusinessStates((states) => {
        states.forEach(element => {
            actualStateList.push(element['business_state'])
        })
        this.setState({
            ...this.state,
            selectedCategory: 'state',
            selectedCategoryList: actualStateList,
        });
    });
  }

  fillFilterSelectorChoices(e) {
    /**
     * Event 'e' is selection of category in <select>.
     * Use target's (option's) value to switch on.
     * > TODO
     *      Set the values of each <option> to be the table names in the future.
     *      Then, have a Client.getDistinctValuesFromTable(tableName, callback).
     */
    var actualStateList = [];
    const selectedCategory = e.target.value;

    switch (selectedCategory) {
        case "state":
            Client.getBusinessStates((states) => {
                states.forEach(element => {
                    actualStateList.push(element['business_state'])
                })
                this.setState({
                    ...this.state,
                    selectedCategory: selectedCategory,
                    selectedCategoryList: actualStateList,
                });
            });
            break;
        default:
            this.setState({
                ...this.state,
                selectedCategory: selectedCategory,
                selectedCategoryList: []
            });
            break;
    }
  }

  handleSelectQueryAttribute(e) {
    /**
     * Event 'e' is click on item in selectedCategoryList
     * Update selectedQueryAttributes and matchingBusinesses in state.
     */

    const selectedAttribute = e.target.innerHTML;
    /**
     *  const query = {
            this.state.selectedQueryAttributes,
            state: selectedAttribute
        };
     */
    const query = {
        state: selectedAttribute,
    };
    var actualBusinessList = [];
    var newSelectedQueryAttributes = {
        ...this.state.selectedQueryAttributes
    };
    newSelectedQueryAttributes[this.state.selectedCategory] = selectedAttribute;

    Client.searchBusinesses(query, (businesses) => {
        businesses.forEach(element => {
            actualBusinessList.push(element['business_name'])
        })
        this.setState({
            ...this.state,
            selectedQueryAttributes: newSelectedQueryAttributes,
            matchingBusinesses: actualBusinessList,
        })
    })
  }

  /**
   * > TODO
   *    handleRemoveQueryAttribute -- handle removal from QueryBox
   */

  render() {
    return (
        <Container fluid={true}>
        <Row>
            <Col>
                <FilterSelector handleSelect={this.fillFilterSelectorChoices.bind(this)} />
            </Col>
            <Col>
                <h5>
                    Query Box
                </h5>
            </Col>
            <Col>
                <h5>
                    Matching Businesses
                </h5>
            </Col>
        </Row>
        <Row>
            <Col>
                <FilterSelectorChoices
                    selectedCategoryList={this.state.selectedCategoryList}
                    handleClick={this.handleSelectQueryAttribute.bind(this)}
                />
            </Col>
            <Col>
                <QueryBox selectedQueryAttributes={this.state.selectedQueryAttributes} />
            </Col>
            <Col>
                <MatchingBusinesses matchingBusinesses={this.state.matchingBusinesses} />
            </Col>
        </Row>
        </Container>
    );
  }
}

export default QueryBuilder;