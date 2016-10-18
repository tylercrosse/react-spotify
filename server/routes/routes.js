import express from 'express';
import request from 'request';
import querystring from 'querystring';
// import cookieParser from 'cookie-parser';

const stateKey = 'spotify_auth_state';
const routes = express.Router();
let env = {};

if(process.env.NODE_ENV !== 'production'){
  env = require('../env.json');
  // process.env.session_secret = env.session_secret;
  process.env.s_client_id = env.s_client_id;
  process.env.s_client_secret = env.s_client_secret;
  process.env.s_redirect_uri = env.s_redirect_uri;
}

function generateRandomString(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


// app.use(express.static(__dirname + '/public'))
//    .use(cookieParser());

routes.get('/login', (req, res) => {
  let state = generateRandomString(16);
  let scope = 'user-read-private user-read-email';
  // res.cookie(stateKey, state);
  
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.s_client_id,
      scope: scope,
      redirect_uri: process.env.s_redirect_uri,
      state: state
    }));
});

routes.get('/callback', (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  // let storedState = req.cookies ? req.cookies[stateKey] : null;

  // if (state === null || state !== storedState) {
  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: process.env.s_redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(process.env.s_client_id + ':' + process.env.s_client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {

        let access_token = body.access_token,
            refresh_token = body.refresh_token;

        let options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(options, (error, response, body) => {
          console.log(body);
        });

        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

routes.get('/refresh_token', (req, res) => {
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {'Authorization': 'Basic ' + (new Buffer(process.env.s_client_id + ':' + process.env.s_client_secret).toString('base64'))},
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };
  
  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

export { routes }