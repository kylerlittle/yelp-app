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
        <ul className="MatchingBusinessesList">
        <Choice>
          <Container>
            <Row>
              <Col>
              <h6 style={{color: 'red'}}>
              {'Name'}
              </h6>
              </Col>
              <Col>
              <h6>
              {'Address'}
              </h6>
              </Col>
              <Col>
              <h6>
              {'City'}
              </h6>
              </Col>
              <Col>
              <h6>
              {'State'}
              </h6>
              </Col>
              <Col>
              <h6>
              {'Avg. Stars'}
              </h6>
              </Col>
              <Col>
              <h6>
              {'Avg. Rating'}
              </h6>
              </Col>
              <Col>
              <h6>
              {'Total CheckIns'}
              </h6>
              </Col>
              <Col>
              <h6>
              {'Total Reviews'}
              </h6>
              </Col>
            </Row>
          </Container>
        </Choice>
        {formattedList}
        </ul>
    );
  }
}

export default MatchingBusinesses;