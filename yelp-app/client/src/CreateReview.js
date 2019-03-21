import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class CreateReview extends Component {
  /**
   * Form component with review_text, user_id, and stars_given options.
   */
  constructor(props) {
    super(props);
    this.state = {
        user_id : 'om5ZiponkpRqUNa3pVPiRg',
        stars_given : 0.0,
        review_text : '',
    }
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

  render() {
    return (
        <Modal {...this.props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                How do you feel about <br /> {this.props.businessName}?
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            <Button onClick={(e) =>
                this.props.handleSubmit(this.state)}>
                Submit
            </Button>
            <Button onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
  }
}

export default CreateReview;