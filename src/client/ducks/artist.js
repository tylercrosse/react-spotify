import { combineReducers } from 'redux';
import helpers from '../utils/helpers';
import { hideResults } from './ui';

// actions
export const REQUEST_ARTISTS = 'REQUEST_ARTISTS';
export const REQUEST_RELATED_ARTISTS = 'REQUEST_RELATED_ARTISTS';

// reducers
function search(state = [], action) {
  switch (action.type) {
    case REQUEST_ARTISTS:
      return {
        results: action.payload.artists.items,
      };
    default:
      return state;
  }
}

function forceData(state = {}, action) {
  switch (action.type) {
    case REQUEST_RELATED_ARTISTS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

const artist = combineReducers({
  search,
  forceData
});

export default artist;

// action creators
export function requestArtists(query) {
  return (dispatch, getState) => {
    const state = getState();
    fetch(`https://api.spotify.com/v1/search?q=${helpers.fixedEncodeURIComponent(query)}&type=artist`, {headers: {Authorization: 'Bearer ' + state.auth.access_token}})
      .then(res => res.json())
      .then((json) => {
        dispatch({
          type: REQUEST_ARTISTS,
          payload: json
        });
      });
      // .catch((err) => {console.log('Request failed', err)})
  };
}

export function requestRelatedArtists(id) {
  return (dispatch, getState) => {
    const state = getState();
    fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {headers: {Authorization: 'Bearer ' + state.auth.access_token}})
      .then(res => res.json())
      .then((json) => {
        const computedForceData = helpers.handleRelatedRes(id, json, state);
        dispatch({
          type: REQUEST_RELATED_ARTISTS,
          payload: computedForceData
        });
        dispatch(hideResults());
      });
      // .catch((err) => {console.log('Request failed', err)})
  };
}
