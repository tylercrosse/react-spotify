import React from 'react';
import ArtistCard from './ArtistCard.js';
import './artist.scss'

export default class ArtistsList extends React.Component {
  constructor() {
    super()
    this.state = {
      clicked: false
    }
  }
  wonkyPassUp(id) {
    // TODO replace with event dispatcher or something better
    this.props.artistId(id)
  }
  render() {
    return (
      <div className="artist-list">
        <span>Artists</span>
        {this.props.results.map((artist, index) => (
          <ArtistCard 
            key={index}
            artist={artist} 
            artistId={(id) => this.wonkyPassUp(id)} 
          />
        ))}
      </div>
    )
  }
}