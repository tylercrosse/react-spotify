import { helpers } from '../utils/helpers.js';

export function selectResult(result) {
  return dispatch => {
    dispatch(requestRelatedArtists(result.id));
  }
}

export function requestValidation() {
  return (dispatch) => {
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

export function toggleResults() {
  return {
    type: 'TOGGLE_RESULTS'
  }
}

export function requestArtists(query, access_token) {
  return (dispatch, getState) => {
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

export function requestRelatedArtists(id) {
  return (dispatch, getState) => {
    const state = getState();
    fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {headers: {'Authorization': 'Bearer ' + state.auth.access_token}})
      .then(res => res.json())
      .then(json => {
        let forceData = helpers.handleRelatedRes(id, json, state)
        dispatch({
          type: 'REQUEST_RELATED_ARTISTS',
          forceData: forceData
        })
        dispatch(toggleResults())
      })
      // .catch((err) => {console.log('Request failed', err)})
  }
}


// ===== LOGIN

// ===== RESULTS

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
