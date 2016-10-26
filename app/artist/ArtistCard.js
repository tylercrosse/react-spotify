import React from 'react';

export default class ArtistCard extends React.Component {
  handleClick(e) {
    this.props.artistId(this.props.artist.id);
  }
  render() {
    return (
      <div 
        className="artist-card" 
        key={this.props.artist.id}
        onClick={(e) => this.handleClick(e)}
      >
        {(this.props.artist.images.length > 0) ? <img src={this.props.artist.images[0].url} alt="profile image" /> : null}
        <span>{this.props.artist.name}</span>
      </div>
    )
  }
}