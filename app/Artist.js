import React from 'react';

export default class Artist extends React.Component {
  handleClick(e) {
    this.props.artistId(this.props.artist.id);
  }
  render() {
    return (
      <div key={this.props.artist.id}>
        <p>Name: {this.props.artist.name}</p>
        {(this.props.artist.images.length > 0) ? <img width="64" src={this.props.artist.images[0].url} alt="profile image" /> : null}
        <button onClick={(e) => this.handleClick(e)}>Get Related Artists</button>
      </div>
    )
  }
}