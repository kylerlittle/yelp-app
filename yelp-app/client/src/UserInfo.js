import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class UserInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: this.props.currUser['user_id'],
            userName: this.props.currUser['user_name'],
        }
    }

    render() {
        console.log(this.props.currUser);
        // this.state = {
        //     userID: this.props.currUser['user_id'],
        //     userName: this.props.currUser['user_name'],
        //     yelping_since: this.props.currUser['yelping_since'],
        //     fans: this.props.currUser['fans'],
        //     average_stars: this.props.currUser['average_stars'],
        //     funny: this.props.currUser['funny'],
        //     cool: this.props.currUser['cool'],
        //     useful: this.props.currUser['useful'],
        //     lat: this.props.currUser['lat'],
        //     long: this.props.currUser['long'],
        // }

        return (
            <>
            { /* User Information */ }
            <div className="UserInfo">
                <p>Name:</p>
                <input type="text" value={this.props.currUser['user_name']}></input>
                <p>Yelping Since</p>
                <input type="text" value={this.props.currUser['yelping_since'] ? this.props.currUser['yelping_since'].split('T')[0] : ''}></input>
                <p>Stars</p>
                <input type="text" value={this.props.currUser['average_stars']}></input>
                <p>Fans</p>
                <input type="text" value={this.props.currUser['fans']}></input>
                { /* Funny, cool, useful */ }
                <Row>
                    <Col>
                    <p>Funny</p>
                    <input type="text" value={this.props.currUser['funny']} style={{width: 60}}></input>
                    </Col>
                    <Col>
                    <p>Cool</p>
                    <input type="text" value={this.props.currUser['cool']} style={{width: 60}}></input>
                    </Col>
                    <Col>
                    <p>Useful</p>
                    <input type="text" value={this.props.currUser['useful']} style={{width: 60}}></input>
                    </Col> 
                </Row>
                { /* Latitude, longitude */ }
                <Row>
                    <Col lg={4}>
                        <p>Latitude</p>
                    </Col>
                    <Col lg={4}>
                        <p>Longitude</p>
                    </Col> 
                </Row> 
                <Row>
                    <Col>
                        <input type="text" defaultValue={this.props.currUser['lat']} style={{width: 130}}></input>
                    </Col>
                    <Col>
                        <input type="text" defaultValue={this.props.currUser['long']} style={{width: 130}}></input>
                    </Col> 
                    <Col>
                    <Button variant="info" size="sm">Submit Changes</Button>
                    </Col> 
                </Row> 
                
            </div>
            </>
        );
      }
}

export default UserInfo;