import React from 'react';

export default class LoggedIn extends React.Component{
  render() {
    return (
      <div id='loggedin' className='loggedin'>
        <img src={this.props.userData.images[0].url} alt='profile image' />
        <span>{this.props.userData.display_name}</span>
      </div>     
    )
  }
}

// <button id="obtain-new-token">Obtain new token using refresh token</button>
