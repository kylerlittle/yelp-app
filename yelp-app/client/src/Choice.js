import React, { Component } from 'react';
import './Choice.css';

class Choice extends Component {
  render() {
    return (
      <div className="Choice" onClick={this.props.handleClick}>
        <li>{this.props.children}</li>
      </div>
    );
  }
}

export default Choice;