// TODO add feature to react
 // document.getElementById('obtain-new-token').addEventListener('click', function() {
//   $.ajax({
//     url: '/refresh_token',
//     data: {
//       'refresh_token': refresh_token
//     }
//   }).done(function(data) {
//     access_token = data.access_token;
//     oauthPlaceholder.innerHTML = oauthTemplate({
//       access_token: access_token,
//       refresh_token: refresh_token
//     });
//   });
// }, false);

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
      artistRes: {}
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
          artistRes: json
        });
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
        <LoggedIn />
        <OauthTemplate access_token={this.state.access_token} refresh_token={this.state.refresh_token} />
        <UserProfile {...this.state.userData} />
        <ArtistSearch newSearch={(f) => this.artistSearchResults(f)} />
        {this.state.artistSearched ? <ArtistsResults results={this.state.artistRes} /> : null}
      </div>
    )
  }
}

class ArtistSearch extends React.Component {
  constructor() {
    super()
    this.state = {
      artistSearch: ''
    }
  }
  updateNewSearch(e) {
    this.setState({
      artistSearch: e.target.value
    });
  }
  handleArtistSearch() {
    this.props.newSearch(this.state.artistSearch);
    this.setState({
      artistSearch: ''
    })
  }
  render() {
    return (
      <div>
        <input type="text" value={this.state.artistSearch} onChange= {(e) => this.updateNewSearch(e)} />
        <button onClick={(e) => this.handleArtistSearch(e)}>Search Artists</button>
      </div>
    )
  }
}
class ArtistsResults extends React.Component {
  render() {
    return (
      <div>
        <h3>Artists</h3>
        <ul>
          {this.props.results.artists.items.map((artist) => (
            <li key={artist.id}>
              <p>Name: {artist.name}</p>
              {(artist.images.length > 0) ? <img width="150" src={artist.images[0].url} alt="profile image" /> : null}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
class Login extends React.Component{
  render() {
    return (
      <div id="login">
        <h1>Test of Auth Code</h1>
        <a href="/login">Log in with Spotify</a>
      </div>
    )
  }
}
class LoggedIn extends React.Component{
  render() {
    return (
      <div id="loggedin">
        <button id="obtain-new-token">Obtain new token using refresh token</button>
      </div>      
    )
  }
}
class UserProfile extends React.Component{
  render() {
    return (
      <div>
        <h1>Logged in as {this.props.display_name}</h1>
        <img width="150" src={this.props.images[0].url} alt="profile image" />
        <dl>
          <dt>Display Name</dt><dd>{this.props.display_name}</dd>
          <dt>Id</dt><dd>{this.props.id}</dd>
          <dt>Email</dt><dd>{this.props.email}</dd>
          <dt>Spotify URI</dt>
          <dd><a href={this.props.external_urls.spotify}>{this.props.external_urls.spotify}</a></dd>
          <dt>Link</dt><dd><a href={this.props.href}>{this.props.href}</a></dd>
          <dt>Country</dt><dd>{this.props.country}</dd>
        </dl>
      </div>
    )
  }
}
class OauthTemplate extends React.Component{
  render() {
    return (
      <div>
        <h2>oAuth info</h2>
        <dl>
          <dt>Access token</dt><dd>{this.props.access_token}</dd>
          <dt>Refresh token</dt><dd>{this.props.refresh_token}</dd>z
        </dl>
      </div>
    )
  }
}

ReactDOM.render(
  <Container />,
  document.getElementById('app')
);