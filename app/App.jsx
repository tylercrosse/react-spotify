import React    from 'react';
import ReactDOM from 'react-dom';
import Login        from './user/Login.jsx';
import LoggedIn     from './user/LoggedIn.jsx';
import ArtistSearch from './artist/ArtistSearch.jsx'
import ArtistsList  from './artist/ArtistsList.jsx'
import VizContainer from './viz/VizContainer.jsx'
import { helpers }  from './utils/helpers.js'

let index = 0;

export default class App extends React.Component{
  constructor() {
    super();
    this.state = {
      access_token: null,
      refresh_token: null,
      userData: null,
      showArtistSearch: false,
      artistRes: null,
      forceData: null,
      clickedNode: null,
    }
    this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount() {
    window.addEventListener('click', this.handleClick, false);
  
    fetch('auth/validate', {credentials: 'include'})
      .then((res) => res.json())
      .then((json) => {
        console.log('Request succesful', json);
        this.setState({
          access_token: json.access_token,
          userData: json.user
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
  d3dblclick(partialState, cb) {
    this.getRelatedArtists(partialState.clickedNode.id)
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
  renderViz() {
    if (this.state.forceData) {
      return (
        <VizContainer 
          forceData={this.state.forceData} 
          d3dblclick={(partialState, cb) => this.d3dblclick(partialState, cb)} 
        /> 
      )
    } else {return null;}
  }
  render() {
    if (!this.state.userData) {
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
        {this.renderViz()}
      </div>
    )
  }
};