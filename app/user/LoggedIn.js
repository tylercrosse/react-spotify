import React from 'react';

export default function LoggedIn(props) {
  return (
    <div id='loggedin' className='loggedin'>
      <img src={props.userData.images[0].url} alt='profile image' />
      <span>{props.userData.display_name}</span>
    </div>     
  )
}

// <button id="obtain-new-token">Obtain new token using refresh token</button>
