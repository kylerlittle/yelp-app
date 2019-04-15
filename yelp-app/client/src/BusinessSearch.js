import React, { Component } from 'react';
import FilterSelector from './FilterSelector';
import FilterSelectorChoices from './FilterSelectorChoices';
import Client from './Client';
import QueryBox from './QueryBox';
import MatchingBusinesses from './MatchingBusinesses';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
// https://www.npmjs.com/package/react-scroll
import { Element } from 'react-scroll';
import SelectedBusiness from './SelectedBusiness';

class BusinessSearch extends Component {
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
        selectedBusiness: {
            name: '',
            id: '',
        },
        selectedBusinessModalShow: false,
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

    const selectedAttribute = e.target.innerText;
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

  handleSelectBusiness(business_id) {
    /**
     * Business selected has an ID 'business_id'.
     * 
     * Open up the SelectedBusiness modal. Query to get the review list.
     * In the future, might want to move this elsewhere.
     */

    // First, find the selectedBusiness's id
    var found = this.state.matchingBusinesses.find((b) => b['id'] === business_id);

    this.setState({
        ...this.state,
        selectedBusinessModalShow: true,
        selectedBusiness: found,
    });

    var actualSelectedBusinessReviews = [];

    Client.getSelectedBusinessReviews(found['id'], (reviews) => {
        reviews.forEach(element => {
            actualSelectedBusinessReviews.push(element)
        });
        this.setState({
            ...this.state,
            selectedBusinessReviews: actualSelectedBusinessReviews,
        });
    })
  }

  selectedBusinessModalClose() {
    this.setState({
        ...this.state,
        selectedBusinessModalShow: false,
    })
  }

  render() {
    return (
        <Container fluid={true}>
        <SelectedBusiness
            selectedBusiness={this.state.selectedBusiness}
            selectedBusinessReviews={this.state.selectedBusinessReviews}
            show={this.state.selectedBusinessModalShow}
            onHide={this.selectedBusinessModalClose.bind(this)}
            userID={this.props.userID}
        />
        <Row>
            <Col lg={4}>
                <FilterSelector handleSelect={this.fillFilterSelectorChoices.bind(this)} />
            </Col>
            <Col lg={4}>
                <h5>
                    Query Box
                </h5>
            </Col>
            <Col lg={4}>
                <h5>
                    Matching Businesses
                </h5>
            </Col>
        </Row>
        <Row>
            <Col lg={4}>
                <Element className="element" id="containerElement" style={{
                position: 'relative',
                height: '60vh',
                overflow: 'scroll',
                }}>
                    <FilterSelectorChoices
                        selectedCategoryList={this.state.selectedCategoryList}
                        handleClick={this.handleSelectQueryAttribute.bind(this)}
                    />
                </Element>
            </Col>
            <Col lg={4}>
                <QueryBox selectedQueryAttributes={this.state.selectedQueryAttributes} />
            </Col>
            <Col lg={4}>
                <Element className="element" id="containerElement" style={{
                    position: 'relative',
                    height: '60vh',
                    overflow: 'scroll',
                }}>
                    <MatchingBusinesses
                        matchingBusinesses={this.state.matchingBusinesses}
                        handleClick={this.handleSelectBusiness.bind(this)}
                    />
                </Element>
            </Col>
        </Row>
        </Container>
    );
  }
}

export default BusinessSearch;