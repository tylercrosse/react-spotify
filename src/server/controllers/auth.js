import request     from 'request';
import querystring from 'querystring';
import logger      from '../config/logger';

const stateKey = 'spotify_auth_state';
let env = {};

if (process.env.NODE_ENV !== 'production') {
  env = require('../env.json');
  process.env.s_client_id = env.s_client_id;
  process.env.s_client_secret = env.s_client_secret;
  process.env.s_redirect_uri = env.s_redirect_uri;
}

const buffer = Buffer.from(process.env.s_client_id + ':' + process.env.s_client_secret).toString('base64');

function _generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
export function spotifyLogin(req, res) {
  const state = _generateRandomString(16);
  const scope = 'user-read-private user-read-email';
  res.cookie(stateKey, state);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.s_client_id,
      scope,
      redirect_uri: process.env.s_redirect_uri,
      state
    }));
}
export function spotifyCallback(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: process.env.s_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization: 'Basic ' + buffer
    },
    json: true
  };
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        req.session.s_access_token = body.access_token;
        req.session.s_refresh_token = body.refresh_token;
        res.redirect('/auth/spotify/refresh_user_data');
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
}
export function spotifyRefreshData(req, res) {
  const options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: 'Bearer ' + req.session.s_access_token },
    json: true
  };
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // find || create in db if there was one
      req.session.current_user = body;
      req.session.save((err) => {
        err && logger.error(err);
      });
    }
  });
  res.redirect('/');
}
export function spotifyRefreshToken(req, res) {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {Authorization: 'Basic ' + buffer},
    form: {
      grant_type: 'refresh_token',
      refresh_token
    },
    json: true
  };
  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        access_token
      });
    }
  });
}
export function checkAuth(req, res) {
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.session.s_access_token) {
    res.json({
      isAuthenticated: 'true',
      user: req.session.current_user,
      access_token: req.session.s_access_token
    });
  } else {
    res.json({isAuthenticated: 'false'});
  }
}
