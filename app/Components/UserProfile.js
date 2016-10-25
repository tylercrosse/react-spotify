import React from 'react';

export default function UserProfile(props) {
  return (
    <div>
      <h1>Logged in as {props.display_name}</h1>
      <img width="150" src={props.images[0].url} alt="profile image" />
      <dl>
        <dt>Display Name</dt><dd>{props.display_name}</dd>
        <dt>Id</dt><dd>{props.id}</dd>
        <dt>Email</dt><dd>{props.email}</dd>
        <dt>Spotify URI</dt>
        <dd><a href={props.external_urls.spotify}>{props.external_urls.spotify}</a></dd>
        <dt>Link</dt><dd><a href={props.href}>{props.href}</a></dd>
        <dt>Country</dt><dd>{props.country}</dd>
      </dl>
    </div>
  )
}