import React from 'react';

export default class UserProfile extends React.Component{
  render() {
    return (
      <div>
        <h1>Logged in as {this.props.display_name}</h1>
        <img width="150" src={this.props.images[0].url} alt="profile image" />
        <dl>
          <dt>Display Name</dt><dd>{this.props.display_name}</dd>
          <dt>Id</dt><dd>{this.props.id}</dd>
          <dt>Email</dt><dd>{this.props.email}</dd>
          <dt>Spotify URI</dt>
          <dd><a href={this.props.external_urls.spotify}>{this.props.external_urls.spotify}</a></dd>
          <dt>Link</dt><dd><a href={this.props.href}>{this.props.href}</a></dd>
          <dt>Country</dt><dd>{this.props.country}</dd>
        </dl>
      </div>
    )
  }
}