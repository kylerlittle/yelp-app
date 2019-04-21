import React, { Component } from 'react';
import Choice from './Choice';
import './MatchingBusinesses.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

class MatchingBusinesses extends Component {
  render() {
    const formattedList = this.props.matchingBusinesses.map((business) =>
        <Choice handleClick={(e) => this.props.handleClick(business['id'])}>
        <Container>
          <Row>
            <Col>
            <h6 style={{color: 'red'}}>
            {business['name']}
            </h6>
            </Col>
            <Col>
            {business['address']}
            </Col>
            <Col>
            {business['city']}
            </Col>
            <Col>
            {business['state']}
            </Col>
            <Col>
            {business['stars']}
            </Col>
            <Col>
            {business['review_rating']}
            </Col>
            <Col>
            {business['num_checkins']}
            </Col>
            <Col>
            {business['review_count']}
            </Col>
          </Row>
        </Container>
        </Choice>
    );
    return (
        <ul className="MatchingBusinessesList">{formattedList}</ul>
    );
  }
}

export default MatchingBusinesses;