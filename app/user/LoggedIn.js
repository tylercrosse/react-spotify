import React from 'react';
import './user.scss'

export default function LoggedIn(props) {
  return (
    <div id='loggedin' className='loggedin'>
      <img src={props.userData.images[0].url} alt='profile image' />
      <span>{props.userData.display_name}</span>
    </div>     
  )
}
