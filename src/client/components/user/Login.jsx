import React from 'react';
import BackgroundAnimation from '../BackgroundAnimation';

export default function Login() {
  return (
    <div id="login" className="login">
      <a className="btn" href="/auth/spotify">Log in with Spotify</a>
      <BackgroundAnimation lineColor="208, 208, 208," circleColor="0, 255, 84," />
    </div>
  );
}
