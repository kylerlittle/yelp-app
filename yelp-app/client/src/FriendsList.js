import React, { Component } from 'react';
import './FriendsList.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class FriendsList extends Component {
    render() {
        const friendsList = this.props.friendsList.map((friend) =>
            <Row>
                <Col><p>{friend['user_name']}</p></Col>
                <Col><p>{friend['average_stars']}</p></Col>
                <Col><p>{friend['yelping_since'].split('T')[0]}</p></Col>
            </Row>
            
        );
        return (
            <div className="FriendsList">
                <h3>Friends</h3>
                <Row>
                    <Col><p>Name</p></Col>
                    <Col><p>Average Stars</p></Col>
                    <Col><p>Yelping Since</p></Col>
                </Row>
                {friendsList}
            </div>
            
        )
    }
}

export default FriendsList;