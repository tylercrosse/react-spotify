import React from 'react';
import Login from './user/Login.js';
import LoggedIn from './user/LoggedIn.js';
import ArtistSearch from './artist/ArtistSearch.js'
import ArtistsList from './artist/ArtistsList.js'
import Chart from './viz/Chart.js'
import { helpers } from './utils/helpers.js'

let index = 0;

class Container extends React.Component{
  constructor() {
    super();
    this.state = {
      access_token: false,
      refresh_token: false,
      userData: null,
      artistSearched: false,
      artistRes: {},
      forceData: null,
      activeNode: null,
    }
  }
  componentWillMount() {
    let params = helpers.getHashParams()
    params.error ? alert('There was an error during the authentication') : null;
    this.setState({
      access_token: params.access_token,
      refresh_token: params.refresh_token
    })
  }
  componentDidMount() {
    fetch('https://api.spotify.com/v1/me', {headers: {'Authorization': 'Bearer ' + this.state.access_token}})
      .then((res) => res.json())
      .then((json) => {
        console.log('Request succesful', json);
        this.setState({
          userData: json
        });
      })
      .catch((err) => {console.log('Request failed', err)})
  }
  artistSearchResults(search) {
    if (this.state.access_token) {
      fetch(`https://api.spotify.com/v1/search?q=${helpers.fixedEncodeURIComponent(search)}&type=artist`, {headers: {'Authorization': 'Bearer ' + this.state.access_token}})
      .then((res) => res.json())
      .then((json) => {
        console.log('Request succesful', json);
        this.setState({
          artistSearched: true,
          artistRes: json.artists.items
        });
      })
      .catch((err) => {console.log('Request failed', err)})
    }
  }
  getRelatedArtists(id) {
    fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {headers: {'Authorization': 'Bearer ' + this.state.access_token}})
      .then(res => res.json())
      .then(json => {
        let newState = helpers.handleRelatedRes(id, json, this.state)
        this.setState(newState)
      })
      .catch((err) => {console.log('Request failed', err)})
  }

  d3related(partialState, cb) {
    this.getRelatedArtists(partialState.activeNode.id)
    return this.setState(partialState, cb);
  }
  render() {
    if (!this.state.userData || !this.state.access_token) {
      return (
        <Login />
      )
    }
    return (
      <div>
        <LoggedIn userData={this.state.userData} />
        <ArtistSearch newSearch={(f) => this.artistSearchResults(f)} />
        {this.state.artistSearched ? <ArtistsList 
          artistId={(id) => this.getRelatedArtists(id)} 
          results={this.state.artistRes} 
          access_token={this.state.access_token} /> : null}
        {this.state.forceData ? <Chart 
          forceData={this.state.forceData} 
          d3related={(partialState, cb) => this.d3related(partialState, cb)} /> : null}
      </div>
    )
  }
}

export default Container