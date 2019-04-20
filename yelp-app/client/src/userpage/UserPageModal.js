import React, { Component } from 'react';
import Client from '../Client';
import UserInfo from './UserInfo';
import FriendsList from './FriendsList';
import SelectedBusinessReviews from '../SelectedBusinessReviews';
import FavoriteBusinessList from './FavoriteBusinessList';
import './UserPageModal.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Element } from 'react-scroll';

class UserPageModal extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.setUser = this.setUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.setFriends = this.setFriends.bind(this);
    this.setFriendsReviews = this.setFriendsReviews.bind(this);
    this.setFavoriteBusinesses = this.setFavoriteBusinesses.bind(this);
    this.removeFavoriteBusinesses = this.removeFavoriteBusinesses.bind(this);

    this.state = {
      show: false,
      userID: '',
      searchUserID: '',       // current string entered in login form
      userInfo: {},
      friends: [],
      friendsReviews: [],
      favoriteBusinesses: [],
      tabsKey: '',            // current selected tab
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
        this.setFriendsReviews(user['user_id']);
        this.setFavoriteBusinesses(user['user_id']);
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
      friendsReviews: [],
      favoriteBusinesses: [],
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

  setFriendsReviews(userID) {
    /**
     * Get most recent review of each friend of current logged in user.
     * Set friends reviews list.
     */
    Client.getFriendsReviews(userID, (reviews) =>{
      if (reviews) {
        this.setState({
          ...this.state,
          friendsReviews: reviews,
        });
        console.log(this.state.friendsReviews);
      }
    });
  }

  setFavoriteBusinesses(userID) {
    /**
     * Get favorite businesses of current logged in user.
     * Set favorite businesses list.
     */
    Client.getFavoriteBusinesses(userID, (businesses) =>{
        this.setState({
          ...this.state,
          favoriteBusinesses: (businesses) ? businesses : [],
        });
        console.log(this.state.favoriteBusinesses);
    });
  }

  removeFavoriteBusinesses(businessID) {
    /**
     * Remove a favorite businesses of current logged in user.
     * Update favorite businesses list.
     */
    console.log(businessID);
    Client.deleteFavoriteBusinesses(this.state.userID, businessID, 
      (ignoreResponse) => {
        // After removal, update favorite business list
        this.setFavoriteBusinesses(this.state.userID);
      }
    );
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
            <Col lg={12}>
              <Tabs defaultActiveKey="userInfo" 
                    id="uncontrolled-tab-example" 
                    activeKey={this.state.key}
                    onSelect={key => this.setState({ 
                      ...this.state,
                      tabsKey: key,
                    })}
              >
                { /* User Information */ }
                <Tab className="Tab" eventKey="userInfo" title="User Info">
                  <UserInfo currUser={this.state['userInfo']}/>
                </Tab>
                { /* Friends list */ }
                <Tab className="Tab" eventKey="friends" title="Friends">
                  <FriendsList friendsList={this.state['friends']}/>
                </Tab>
                { /* Friends Reviews list */ }
                <Tab className="Tab" eventKey="friendsReviews" title="Friend's Reviews">
                  <Element className="element" id="containerElement" style={{
                          position: 'relative',
                          height: '60vh',
                          overflowY: 'scroll',
                          overflowX: 'hidden',
                  }}>
                    <SelectedBusinessReviews reviewList={this.state.friendsReviews}/>
                  </Element>
                </Tab>
                { /* User Favorite Businesses */ }
                <Tab className="Tab" eventKey="favoriteBusinesses" title="Favorite Businesses">
                  <Element className="element" id="containerElement" style={{
                            position: 'relative',
                            height: '60vh',
                            overflowY: 'scroll',
                            overflowX: 'hidden',
                    }}>
                    <FavoriteBusinessList businessList={this.state.favoriteBusinesses}
                                          handleRemoveBusiness={this.removeFavoriteBusinesses}
                    />
                  </Element>
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