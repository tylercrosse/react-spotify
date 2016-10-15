import React from 'react';

export default class OauthTemplate extends React.Component{
  render() {
    return (
      <div>
        <h2>oAuth info</h2>
        <dl>
          <dt>Access token</dt><dd>{this.props.access_token}</dd>
          <dt>Refresh token</dt><dd>{this.props.refresh_token}</dd>z
        </dl>
      </div>
    )
  }
}