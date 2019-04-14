import React, { Component } from 'react';
import Client from './Client';
import FriendsList from './FriendsList';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class UserPageModal extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.setUser = this.setUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.setFriends = this.setFriends.bind(this);

    this.state = {
      show: false,
      userID: '',
      searchUserID: '',
      userName: '',
      userInfo: null,
      yelping_since: '',
      fans: '',
      average_stars: '',
      funny: '',
      cool: '',
      useful: '',
      lat: 0,
      long: 0,
      friends: [],
    };
  }

  handleClose() {
    this.setState({ show: false });
  }   
  handleShow() {
    this.setState({ show: true });
  }
  handleTextChange(e) {
    const { target } = e;
    const value = target.value;
    this.setState({
      ...this.state,
      searchUserID: value,
    });
  }
  setUser(e) {
    // sample userID: om5ZiponkpRqUNa3pVPiRg
    /**
     * Login to user specified by userID entered.
     * Set state's user info.
     */
    Client.getUserInfo(this.state.searchUserID, (user) =>{
      user = user[0];
      if (user) {
        this.setState({
          ...this.state,
          userID: user['user_id'],
          userName: user['user_name'],
          userInfo: user,
          yelping_since: user['yelping_since'].split('T')[0],
          fans: user['fans'],
          average_stars: user['average_stars'],
          funny: user['funny'],
          cool: user['cool'],
          useful: user['useful'],
        });
        this.setFriends(user['user_id']);
        console.log(user['user_name']);
      }
    });
  }
  logoutUser(e) {
    /**
     * Logout current user.
     * Clear states current user info.
     */
    this.setState({
      ...this.state,
      userID: '',
      userName: '',
      userInfo: null,
      yelping_since: '',
      fans: '',
      average_stars: '',
      funny: '',
      cool: '',
      useful: '',
      lat: 0,
      long: 0,
      friends: [],
    });
    console.log(this.state);
  }
  setFriends(userID) {
    /**
     * Get friends list of current logged in user.
     * Set friends list.
     */
    Client.getUserFriends(userID, (friends) =>{
      if (friends) {
        this.setState({
          ...this.state,
          friends: friends,
        });
        console.log(this.state.friends);
      }
    });
  }

  render() {
    return (
      <>
      <Button variant="primary" onClick={this.handleShow}>
        User Page
      </Button>

      <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Page</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        { /* Login Form */ }
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="User ID" onChange={this.handleTextChange}></input>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" onClick={this.setUser}>Login</button>
          </div>
        </div>

        <Row>
          { /* User Information */ }
          <Col lg={6} className="userInfo">
            <p>Name:</p>
            <input type="text" value={this.state['userName']}></input>
            <p>Yelping Since</p>
            <input type="text" value={this.state['yelping_since']}></input>
            <p>Stars</p>
            <input type="text" value={this.state['average_stars']}></input>
            <p>Fans</p>
            <input type="text" value={this.state['fans']}></input>
            { /* Funny, cool, useful */ }
            <Row>
              <Col>
                <p>Funny</p>
                <input type="text" value={this.state['funny']} style={{width: 60}}></input>
              </Col>
              <Col>
                <p>Cool</p>
                <input type="text" value={this.state['cool']} style={{width: 60}}></input>
              </Col>
              <Col>
                <p>Useful</p>
                <input type="text" value={this.state['useful']} style={{width: 60}}></input>
              </Col> 
            </Row>
            { /* Latitude, longitude */ }
            <Row>
              <Col>
                <p>Latitude</p>
                <input type="text" value={this.state['lat']} style={{width: 130}}></input>
              </Col>
              <Col>
                <p>Longitude</p>
                <input type="text" value={this.state['long']} style={{width: 130}}></input>
              </Col> 
            </Row> 
          </Col>
          { /* Friends list */ }
          <Col lg={6}>
            <FriendsList friendsList={this.state.friends}/>
          </Col>

          
        </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.logoutUser}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    );
  }
}

export default UserPageModal;