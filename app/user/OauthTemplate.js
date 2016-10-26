import React from 'react';

export default function OauthTemplate(props) {
  return (
    <div>
      <h2>oAuth info</h2>
      <dl>
        <dt>Access token</dt><dd>{props.access_token}</dd>
        <dt>Refresh token</dt><dd>{props.refresh_token}</dd>z
      </dl>
    </div>
  )
}

// <button id="obtain-new-token">Obtain new token using refresh token</button>