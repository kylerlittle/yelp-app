import React, { Component } from 'react';
import Client from './Client';
import UserInfo from './UserInfo';
import FriendsList from './FriendsList';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContent from 'react-bootstrap/TabContent';

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
      userInfo: {},
      friends: [],
      tabsKey: '',
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
          userInfo: user,
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
      userInfo: {
              userID: '',
              user_name: '',
              yelping_since: '',
              fans: '',
              average_stars: '',
              funny: '',
              cool: '',
              useful: '',
              lat: '',
              long: '',
      },
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
            <Col lg={6} >
              <UserInfo currUser={this.state['userInfo']}/>
            </Col>
            

            <Col lg={6}>
              <Tabs defaultActiveKey="friendsReviews" 
                    id="uncontrolled-tab-example" 
                    activeKey={this.state.key}
                    onSelect={key => this.setState({ 
                      ...this.state,
                      tabsKey: key,
                    })}
              >
                <Tab eventKey="friends" title="Friends">
                  <TabContent>
                    { /* Friends list */ }
                    <FriendsList friendsList={this.state['friends']}/>
                  </TabContent>
                </Tab>
                <Tab eventKey="friendsReviews" title="Reviews">
                  <p>hello2</p>
                </Tab>
                <Tab eventKey="favoriteBusinesses" title="Favorite Businesses" disabled>
                  <p>hello3</p>
                </Tab>
              </Tabs>
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