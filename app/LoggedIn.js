import React from 'react';

export default class LoggedIn extends React.Component{
  render() {
    return (
      <div id="loggedin">
        <button id="obtain-new-token">Obtain new token using refresh token</button>
      </div>      
    )
  }
}