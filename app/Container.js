import React from 'react';
import Login from './Login.js';
import ArtistSearch from './ArtistSearch.js'
import ArtistList from './ArtistList.js'
import Chart from './Chart.js'

function getHashParams() {
  let hashParams = {};
  let e;
  let r = /([^&;=]+)=?([^&;]*)/g
  let q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams
}
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

class Container extends React.Component{
  constructor() {
    super();
    this.state = {
      access_token: false,
      refresh_token: false,
      userData: false,
      artistSearched: false,
      artistRes: {},
      forceData: false,
    }
  }
  componentWillMount() {
    let params = getHashParams()
    params.error ? alert('There was an error during the authentication') : null;
    this.setState({
      access_token: params.access_token,
      refresh_token: params.refresh_token
    })
  }
  componentDidMount() {
    // fetch('https://api.spotify.com/v1/me', {headers: {'Authorization': 'Bearer ' + this.state.access_token}})
    //   .then((res) => res.json())
    //   .then((json) => {
    //     console.log('Request succesful', json);
    //     this.setState({
    //       userData: json
    //     });
    //   })
    //   .catch((err) => {console.log('Request failed', err)})
  }
  artistSearchResults(search) {
    fetch(`https://api.spotify.com/v1/search?q=${fixedEncodeURIComponent(search)}&type=artist`, {headers: {'Authorization': 'Bearer ' + this.state.access_token}})
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
  getRelatedArtists(id) {
    fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {headers: {'Authorization': 'Bearer ' + this.state.access_token}})
      .then((res) => res.json())
      .then((json) => {
        console.log('Request succesful', json);
        let nodes = json.artists.map(function(val) {
          return {"id": val.id, "name": val.name, "image": val.images.pop()}
        })
        let links = json.artists.map(function(val) {
          return {"source": id, "target": val.id}
        })
        let source = this.state.artistRes.find((obj) => (obj.id === id))
        nodes.push({
          "id": source.id, "name": source.name, "image": source.images.pop()
        })
        this.setState({
          forceData: {"nodes": nodes, "links": links}
        }) 
      })
      .catch((err) => {console.log('Request failed', err)})
  }
  render() {
    if (!this.state.userData) {
      return (
        <Login />
      )
    }
    return (
      <div>
        <ArtistSearch newSearch={(f) => this.artistSearchResults(f)} />
        {this.state.artistSearched ? <ArtistsList artistId={(id) => this.getRelatedArtists(id)} results={this.state.artistRes} access_token={this.state.access_token} /> : null}
        {this.state.forceData ? <Chart forceData={this.state.forceData} /> : null}
      </div>
    )
  }
}

export default Container