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
            price: '',
            categories: [],
            attributes: [],
            meals: [],
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
    var returnedSelectedCategoryList = [];

    Client.getSelectedQueryAttributeWithQueryString('states', {},
        (states) => {
        states.forEach(element => {
            returnedSelectedCategoryList.push(Object.values(element)[0])
        })
        /* By default, display 'state' when user loads page. */
        this.setState({
            ...this.state,
            selectedCategory: 'state',
            selectedCategoryList: returnedSelectedCategoryList,
        });
    });
  }

  fillFilterSelectorChoices(e) {
    /**
     * Event 'e' is selection of category in <select>.
     * Use target's (option's) value for selectedCategoryList, but
     * convert it to the correct URI for the calls to backend.
     */
    var returnedSelectedCategoryList = [], selectedCategoryAPI = '';
    const selectedCategory = e.target.value;
    
    switch(selectedCategory) {
        case "state": selectedCategoryAPI = "states"; break;
        case "city": selectedCategoryAPI = "cities"; break;
        case "zipcode": selectedCategoryAPI = "zipcodes"; break;
        case "price": selectedCategoryAPI = "prices"; break;
        case "categories": selectedCategoryAPI = "categories"; break;
        case "attributes": selectedCategoryAPI = "attributes"; break;
        case "meals": selectedCategoryAPI = "meals"; break;
        default: console.log("fillFilterSelectorChoices() -- bad selectedCategory"); break;
    }

    Client.getSelectedQueryAttributeWithQueryString(
        selectedCategoryAPI, this.state.selectedQueryAttributes, (returnedObj) => {
            returnedObj.forEach(element => {
                returnedSelectedCategoryList.push(Object.values(element)[0])
            });
            console.log(returnedObj)
            this.setState({
                ...this.state,
                selectedCategory: selectedCategory,
                selectedCategoryList: returnedSelectedCategoryList,
            });
    });
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