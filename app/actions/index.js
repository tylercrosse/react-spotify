import { helpers } from '../utils/helpers.js';

export function requestValidation() {
  return function(dispatch) {
    fetch('auth/validate', {credentials: 'include'})
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: 'REQUEST_VALIDATION',
          payload: json
        })
      })
      // .catch((err) => {console.log('Request failed', err)})
  }
}

export function requestArtists(query, access_token) {
  return function(dispatch, getState) {
    const state = getState();
    fetch(`https://api.spotify.com/v1/search?q=${helpers.fixedEncodeURIComponent(query)}&type=artist`, {headers: {'Authorization': 'Bearer ' + state.auth.access_token}})
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: 'REQUEST_ARTISTS',
          payload: json
        })
      })
      // .catch((err) => {console.log('Request failed', err)})
  }
}

export function requestRelatedArtists(artistId) {
  return function(dispatch, getstate) {
    const state = getState();
    fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {headers: {'Authorization': 'Bearer ' + this.state.access_token}})
      .then(res => res.json())
      .then(json => {
        let forceData = helpers.handleRelatedRes(id, json, this.state)
        this.setState({
          showArtistSearch: false,
          forceData: forceData
        });
      })
      // .catch((err) => {console.log('Request failed', err)})
  }
}


// ===== LOGIN

// ===== SEARCH

// searchsumbit
// clearsearchfield
// searchresultclick
// windowclick ?? close search results

// ===== VIZ

// forcetreedoubleclick
// forcetreemouseover
// forcetreemouseout

// ===== AJAX

// fetchValidation
  // initiated, error, success
// fetchSearchResults
  // initiated, error, success
// fetchRelatedArtists
  // initiated, error, success
