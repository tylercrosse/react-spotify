import React from 'react';

export default class Login extends React.Component{
  render() {
    return (
      <div id="login" className="login">
        <a className="btn" href="/login">Log in with Spotify</a>
      </div>
    )
  }
}