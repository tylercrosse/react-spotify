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
