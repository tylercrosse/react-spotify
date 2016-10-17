import React from 'react';
import Login from './Login.js';
import ArtistSearch from './ArtistSearch.js'
import ArtistsList from './ArtistsList.js'
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
      userData: null,
      artistSearched: false,
      artistRes: {},
      forceData: null,
      activeNode: null,
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
        let trimRes = json.artists.splice(0, Math.floor(json.artists.length / 2))
        console.log('Request succesful', trimRes);
        let newNodes = trimRes.map((val) => (
          {"id": val.id, "cluster": id, "name": val.name, "image": val.images.pop()}
        ))
        let newLinks = trimRes.map((val) => (
          {"source": id, "target": val.id}
        ))
        if (!this.state.forceData) {
          // no old data
          let source = this.state.artistRes.find((obj) => (obj.id === id))
          newNodes.push({
            "id": source.id, "name": source.name, "image": source.images.pop()
          })
          return this.setState({
            forceData: {"nodes": newNodes, "links": newLinks}
          }) 
        } else { 
          // add to exiisting data
          let newUniqNodes = uniq(this.state.forceData.nodes, newNodes, 'id')
          let nodesUnion = this.state.forceData.nodes.concat(newUniqNodes)
          let newUniqLinks = newUniqNodes.map((val) => (
            {"source": id, "target": val.id}
          ))
          let newDupNodes = dups(this.state.forceData.nodes, newNodes, 'id')
          console.log(newDupNodes)
          let newDupLinks = newDupNodes.map((val) => (
            {"source": id, "target": val.id}
          ))
          let linksConcat = this.state.forceData.links.concat(newUniqLinks, newDupLinks)
          this.setState({
            forceData: {"nodes": nodesUnion, "links": linksConcat}
          }) 
        }
        function uniq(arr1, arr2, prop) {
          for (let i=0; i<arr1.length; i++) {
            for (let j=0; j<arr2.length; j++) {
              if (arr1[i][prop] === arr2[j][prop]) arr2.splice(j, 1);
            }
          }
          return arr2
        }
        function dups(arr1, arr2, prop) {
          let dups = []
          for (let i=0; i<arr1.length; i++) {
            for (let j=0; j<arr2.length; j++) {
              if (arr1[i][prop] === arr2[j][prop]) dups.push(arr2.splice(j, 1));
            }
          }
          return dups
        }
      })
      .catch((err) => {console.log('Request failed', err)})
  }
  d3related(partialState, cb) {
    this.getRelatedArtists(partialState.activeNode.id)
    return this.setState(partialState, cb);
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
        {this.state.forceData ? <Chart forceData={this.state.forceData} d3related={(partialState, cb) => this.d3related(partialState, cb)} /> : null}
      </div>
    )
  }
}

export default Container