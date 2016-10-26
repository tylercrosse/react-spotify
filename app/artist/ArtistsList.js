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
        {this.props.results.map((artist, index) => (
          <ArtistCard artistId={(id) => this.wonkyPassUp(id)} artist={artist} key={index} />
        ))}
      </div>
    )
  }
}