import React, { Component } from 'react';
import Client from './Client';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

class UserPageModal extends Component {
    constructor(props) {
        super(props);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    
        this.state = {
          show: false,
          userID: '',
          searchUserID: '',
          userName: 'test name',
          userInfo: null,
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
        // om5ZiponkpRqUNa3pVPiRg
        Client.getUserInfo(this.state.searchUserID, (user) =>{
          user = user[0];
          this.setState({
            ...this.state,
            userID: user.user_id,
            userName: user.user_name,
            userInfo: user,
          });
          console.log(user.user_name);
        });
      }

      render() {
        return (
          <>
          <Button variant="primary" onClick={this.handleShow}>
            User Page
          </Button>
  
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>User Page</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <div className="userSearch">
              <input type="text" placeholder="Search.." onChange={this.handleTextChange.bind(this)}></input>
              <button type="submit" onClick={this.setUser.bind(this)}>Find User</button>
            </div>      
            <div className="userInfo">
              <p>Name:</p>
              <input type="text" value={this.state.userName}></input>
            </div>        

            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2"></input>
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button">Button</button>
              </div>
            </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          </>
        );
      }
}

export default UserPageModal;