import React, { Component } from 'react';
import Choice from './Choice';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

/**
 * Add this back later when I can handle closes...
 
 <button type="button" className="close removeQueryAttr" aria-label="Close">
<span aria-hidden="true">×</span>
</button>

 */

class QueryBox extends Component {
  render() {
    const formattedQueryAttributes = Object.keys(this.props.selectedQueryAttributes).map((category, index) =>
        <Choice>
          <Container>
            <Row>
              <Col>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Col>
              <Col>
                {this.props.selectedQueryAttributes[category]}
              </Col>
            </Row>
          </Container>
        </Choice>   
    );
    return (
      <div className="QueryBox">
        <ul style={{listStyleType: 'none', display: "inline"}}>
            {formattedQueryAttributes}
        </ul>
      </div>
    );
  }
}

export default QueryBox;