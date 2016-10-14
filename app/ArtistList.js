import React from 'react';
import Artist from './Artist.js';

class ArtistsList extends React.Component {
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
      <div>
        {this.props.results.map((artist, index) => (
          <Artist artistId={(id) => this.wonkyPassUp(id)} artist={artist} key={index} />
        ))}
      </div>
    )
  }
}