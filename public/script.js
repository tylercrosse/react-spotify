(function(){
  
  // TODO convert to local storage
  function getHashParams() {
    var hashParams = {};
    var e;
    var r = /([^&;=]+)=?([^&;]*)/g
    var q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams
  }
  
  var userProfileSource = document.getElementById('user-profile-template').innerHTML;
  var userProfileTemplate = Handlebars.compile(userProfileSource);
  var userProfilePlaceHolder = document.getElementById('user-profile');
  
  var oauthSource = document.getElementById('oauth-template').innerHTML;
  var oauthTemplate = Handlebars.compile(oauthSource);
  var oauthPlaceholder = document.getElementById('oauth');
  
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
})();