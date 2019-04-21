import React, { Component } from 'react';
import './Choice.css';
import Client from './Client';
import SelectedBusinessReviews from './SelectedBusinessReviews';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// https://www.npmjs.com/package/react-scroll
import { Element } from 'react-scroll';
import StarRatings from 'react-star-ratings';

class SelectedBusiness extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedBusinessReviews : this.props.selectedBusinessReviews,
            user_id : this.props.userID,
            stars_given : 0.0,
            review_text : '',
        };

        this.handleSubmitReview = this.handleSubmitReview.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this);
        this.changeRating = this.changeRating.bind(this);
    }

    handleTextChange(e) {
        const { target } = e;
        const value = target.value;
        const { name } = target;
        this.setState({
            ...this.state,
            [name]: value,
        })
    }
  
    changeRating( newRating, name ) {
      this.setState({
          ...this.state,
          stars_given: newRating
      });
    }

    handleSubmitReview() {
        var businessReviews = [];

        Client.postReview(this.props.selectedBusiness['id'], this.state,
            (ignoreResponse) => {
                // Since review is new, update review list!
                Client.getSelectedBusinessReviews(this.props.selectedBusiness['id'], (reviews) => {
                    reviews.forEach(element => {
                        businessReviews.push(element)
                    });
                    this.setState({
                        ...this.state,
                        selectedBusinessReviews: businessReviews,
                        reviewUpdateToggle: !this.state.reviewUpdateToggle,
                    });
                })
            }
        );
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.selectedBusinessReviews !== this.state.selectedBusinessReviews) {
          this.setState({ selectedBusinessReviews: nextProps.selectedBusinessReviews });
        }
      }

    render() {
        return (
            <Modal
                show={this.props.show}
                aria-labelledby="contained-modal-title-vcenter"
                size={'lg'}
            >
            <Modal.Header closeButton onClick={this.props.onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
                {this.props.selectedBusiness['name']}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container fluid={true}>
                <h5>
                    Reviews
                </h5>
                <Col lg={12}>
                    <Element className="element" id="containerElement" style={{
                            position: 'relative',
                            height: '60vh',
                            overflow: 'scroll',
                    }}>
                    <SelectedBusinessReviews
                        reviewList={this.state.selectedBusinessReviews || []}
                        reviewsNeedUpdated={this.state.reviewUpdateToggle}
                    />
                    </Element>
                </Col>
            </Container>
            <Form>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="3">
                    User ID
                    </Form.Label>
                    <Col sm="9">
                    <Form.Control
                        plaintext
                        defaultValue="om5ZiponkpRqUNa3pVPiRg"
                        name="user_id"
                        onChange={this.handleTextChange}
                    />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formStarRating">
                    <Col sm="3" />
                    <Col sm="6">
                        <StarRatings
                            rating={this.state.stars_given}
                            starDimension={'40px'}
                            starSpacing={'1px'}
                            starRatedColor={'blue'}
                            changeRating={this.changeRating}
                            isSelectable={true}
                        />
                    </Col>
                    <Col sm="3" />
                </Form.Group>
                <Form.Group controlId="formReviewText">
                    <Form.Control
                        placeholder="Write your review here..."
                        as="textarea"
                        rows="3"
                        name="review_text"
                        onChange={this.handleTextChange}
                    />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={this.handleSubmitReview}>
                Submit
            </Button>
            <Button onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
        );
    }
}

export default SelectedBusiness;