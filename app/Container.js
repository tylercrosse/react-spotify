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
    const opts = {
      headers: {
        'Authorization': 'Bearer ' + this.state.access_token
      }
    };
    return fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, opts)
      .then(res => res.json())
      .then(json => {
        let newNodes = json.artists.map(val => ({
          index: index++,
          id: val.id,
          cluster: id,
          name: val.name,
          image: val.images.pop()
        }));
        let newLinks = json.artists.map(val => ({
          index: index++,
          source: id,
          target: val.id
        }));

        if (!this.state.forceData) {
          // no old data
          let source = this.state.artistRes.find(obj => obj.id === id);

          newNodes.push({
            id: source.id,
            name: source.name,
            image: source.images.pop()
          });

          const newState = {
            forceData: {
              nodes: newNodes,
              links: newLinks
            }
          };
          return this.setState(newState);

        } else {
          const allNodes = this.state.forceData.nodes.reduce((acc, node) => {
            acc[node.id] = node;
            return acc;
          }, {});

          for (let node of newNodes) {
            allNodes[node.id] = allNodes[node.id] || node;
          }
          // Old AND new nodes are all in `allNodes`
          const allLinks = this.state.forceData.links
            .map(n => ({
              source: n.source.id,
              target: n.target.id
            }))
            .reduce((acc, link) => {
              acc[link.source + ':' + link.target] = link;
              return acc;
            }, {});

          for (let link of newLinks) {
            const key = `${link.source}:${link.target}`;
            allLinks[key] = allLinks[key] || link;
          }

          // All links are in `allLinks`;
          var newData = {
            forceData: {
              nodes: values(allNodes).map(Node),
              links: values(allLinks).map(Link)
            }
          };
          this.setState(newData);
        }
        
        function Node({ index, id, cluster, name, image }) {
          return { index, id, cluster, name, image };
        }
        function Link({ index, source, target }) {
          return { index, source, target };
        }
        function values(object) {
          return Object.keys(object).map(key => object[key]);
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