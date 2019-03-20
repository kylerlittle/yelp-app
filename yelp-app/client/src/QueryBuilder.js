import React, { Component } from 'react';
import FilterSelector from './FilterSelector';
import FilterSelectorChoices from './FilterSelectorChoices';
import Client from './Client';
import QueryBox from './QueryBox';
import MatchingBusinesses from './MatchingBusinesses';
import SelectedBusinessReviews from './SelectedBusinessReviews';
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
            categories: [],
        },
        matchingBusinesses: [],
        selectedBusiness: '',
        selectedBusinessReviews: [],
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
     *      Refactor code here.
     *      Set the values of each <option> to match the API calls.
     */
    var returnedSelectedCategoryList = [];
    const selectedCategory = e.target.value;

    switch (selectedCategory) {
        case "state":
            Client.getBusinessStates(
                (states) => {
                    states.forEach(element => {
                        returnedSelectedCategoryList.push(element['business_state'])
                    })
                    this.setState({
                        ...this.state,
                        selectedCategory: selectedCategory,
                        selectedCategoryList: returnedSelectedCategoryList,
                    })
                }
            );
            break;
        case "city":
            Client.getBusinessCities(
                this.state.selectedQueryAttributes['state'],
                (cities) => {
                    cities.forEach(element => {
                        returnedSelectedCategoryList.push(element['business_city'])
                    })
                    this.setState({
                        ...this.state,
                        selectedCategory: selectedCategory,
                        selectedCategoryList: returnedSelectedCategoryList,
                    })
                }
            );
            break;
        case "zipcode":
            Client.getBusinessZIPCodes(
                this.state.selectedQueryAttributes['state'],
                this.state.selectedQueryAttributes['city'],
                (zipcodes) => {
                    zipcodes.forEach(element => {
                        returnedSelectedCategoryList.push(element['postal_code'])
                    })
                    this.setState({
                        ...this.state,
                        selectedCategory: selectedCategory,
                        selectedCategoryList: returnedSelectedCategoryList,
                    })
                }
            );
            break;
        case "categories":
            Client.getBusinessCategories(
                this.state.selectedQueryAttributes['state'],
                this.state.selectedQueryAttributes['city'],
                this.state.selectedQueryAttributes['zipcode'],
                (zipcodes) => {
                    zipcodes.forEach(element => {
                        returnedSelectedCategoryList.push(element['category_name'])
                    })
                    this.setState({
                        ...this.state,
                        selectedCategory: selectedCategory,
                        selectedCategoryList: returnedSelectedCategoryList,
                    })
                }
            );
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
    var actualBusinessList = [];

    var newSelectedQueryAttributes = {
        ...this.state.selectedQueryAttributes
    };
    if (newSelectedQueryAttributes[this.state.selectedCategory] instanceof Array) {
        // Array to Set to Array to remove duplicates
        newSelectedQueryAttributes[this.state.selectedCategory] =
            Array.from(new Set([...this.state.selectedQueryAttributes[this.state.selectedCategory], selectedAttribute]));
    } else {
        newSelectedQueryAttributes[this.state.selectedCategory] = selectedAttribute;
    }
    console.log(newSelectedQueryAttributes);

    Client.searchBusinesses(newSelectedQueryAttributes, (businesses) => {
        businesses.forEach(element => {
            actualBusinessList.push({'name': element['business_name'], 'id': element['business_id']})
        });
        this.setState({
            ...this.state,
            selectedQueryAttributes: newSelectedQueryAttributes,
            matchingBusinesses: actualBusinessList,
        });
    })
    console.log(this.state.selectedQueryAttributes);
  }

  /**
   * > TODO
   *    handleRemoveQueryAttribute -- handle removal from QueryBox
   */

  handleSelectBusiness(e) {
    /**
     * Event 'e' is click on item in selectedCategoryList
     * Update selectedBusiness and selectedBusinessReviews.
     */

    const selectedBusiness = e.target.innerHTML;
    console.log(`selectedBusiness: ${selectedBusiness}`);
    var actualSelectedBusinessReviews = [];

    // First, find the selectedBusiness's id
    var found = this.state.matchingBusinesses.find((b) => b['name'] === selectedBusiness.replace(/&amp;/g, '&'));
    console.log(found)

    Client.getSelectedBusinessReviews(found['id'], (reviews) => {
        reviews.forEach(element => {
            actualSelectedBusinessReviews.push(element)
        });
        this.setState({
            ...this.state,
            selectedBusiness: found,
            selectedBusinessReviews: actualSelectedBusinessReviews,
        });
    })

    console.log(this.state)
  }

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
            <Col>
                <h5>
                    {`${(this.state.selectedBusiness) ? this.state.selectedBusiness['name'] : ''} Reviews`}
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
                <MatchingBusinesses
                    matchingBusinesses={this.state.matchingBusinesses}
                    handleClick={this.handleSelectBusiness.bind(this)}
                />
            </Col>
            <Col>
                <SelectedBusinessReviews reviewList={this.state.selectedBusinessReviews}/>
            </Col>
        </Row>
        </Container>
    );
  }
}

export default QueryBuilder;