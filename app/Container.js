import React from 'react';
import ReactDOM from 'react-dom';
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
      access_token: null,
      refresh_token: null,
      userData: null,
      showArtistSearch: false,
      artistRes: null,
      forceData: null,
      activeNode: null,
    }
    this.handleClick = this.handleClick.bind(this)
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
    window.addEventListener('click', this.handleClick, false);
  
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
  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick, false)
  }
  artistSearchResults(search) {
    if (this.state.access_token) {
      fetch(`https://api.spotify.com/v1/search?q=${helpers.fixedEncodeURIComponent(search)}&type=artist`, {headers: {'Authorization': 'Bearer ' + this.state.access_token}})
      .then((res) => res.json())
      .then((json) => {
        console.log('Request succesful', json);
        this.setState({
          showArtistSearch: true,
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
        let forceData = helpers.handleRelatedRes(id, json, this.state)
        this.setState({
          showArtistSearch: false,
          forceData: forceData
        });
      })
      .catch((err) => {console.log('Request failed', err)})
  }
  d3related(partialState, cb) {
    this.getRelatedArtists(partialState.activeNode.id)
    return this.setState(partialState, cb);
  }
  handleClick(e) {
    if (this.state.showArtistSearch) {
      const area = ReactDOM.findDOMNode(this.refs.area);
      if (!area.contains(e.target)) {
        this.setState({showArtistSearch: false});
      }
    }
  }
  renderArtistRes() {
    if (this.state.showArtistSearch) {
      return (
        <ArtistsList
          ref='area'
          artistId={(id) => {
            this.setState({forceData: null});
            this.getRelatedArtists(id)
          }} 
          results={this.state.artistRes} 
          access_token={this.state.access_token} 
        />
      )
    } else {return null;}
  }
  renderChart() {
    if (this.state.forceData) {
      return (
        <Chart 
          forceData={this.state.forceData} 
          d3related={(partialState, cb) => this.d3related(partialState, cb)} 
        /> 
      )
    } else {return null;}
  }
  render() {
    if (!this.state.userData || !this.state.access_token) {
      return (
        <Login />
      )
    }
    return (
      <div>
        <div className="nav">
          <ArtistSearch newSearch={(f) => this.artistSearchResults(f)} />
          <LoggedIn userData={this.state.userData} />
        </div>
        {this.renderArtistRes()}
        {this.renderChart()}
      </div>
    )
  }
}

export default Container