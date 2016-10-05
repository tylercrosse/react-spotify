
let params = getHashParams()
let access_token = params.access_token;
let refresh_token = params.refresh_token;
params.error ? alert('There was an error during the authentication') : null;
let res = {};
if (access_token) {
  fetch('https://api.spotify.com/v1/me', {headers: {'Authorization': 'Bearer ' + access_token}})
    .then((res) => {return res.json()})
    .then((json) => {res = json })
    .catch((err) => {console.log('Request failed', err)})
}

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

class Container extends React.Component{
  constructor() {
    super();
    this.state = {
      access_token: false,
      userData: null
    }
  }
  componentWillMount() {
    fetch('https://api.spotify.com/v1/me', {headers: {'Authorization': 'Bearer ' + access_token}})
      .then((res) => {return res.json()})
      .then((json) => {
        console.log('Request succesful', json);
        this.setState({
          userData: json
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
        {access_token ? <OauthTemplate /> : null}
        <UserProfile {...this.state.userData} />
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
          <dt>Access token</dt><dd>{access_token}</dd>
          <dt>Refresh token</dt><dd>{refresh_token}</dd>z
        </dl>
      </div>
    )
  }
}

ReactDOM.render(
  <Container />,
  document.getElementById('app')
);


function oldCode() {
  var params = getHashParams();
  var access_token = params.access_token;
  var refresh_token = params.refresh_token;
  var error = params.error;
  
  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });
      
      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          userProfilePlaceHolder.innerHTML = userProfileTemplate(response);
          
          $('#login').hide();
          $('#loggedin').show();
        }
      });
    } else {
      $('#login').show();
      $('#loggedin').hide();
    }
    
    document.getElementById('obtain-new-token').addEventListener('click', function() {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function(data) {
        access_token = data.access_token;
        oauthPlaceholder.innerHTML = oauthTemplate({
          access_token: access_token,
          refresh_token: refresh_token
        });
      });
    }, false);
  }
};