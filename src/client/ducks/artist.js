import { combineReducers } from 'redux';
import helpers from '../utils/helpers';
import { hideResults } from './ui';

// actions
export const ARTIST_SEARCH_REQUEST = 'ARTIST_SEARCH_REQUEST';
export const ARTIST_SEARCH_SUCCESS = 'ARTIST_SEARCH_SUCCESS';
export const ARTIST_SEARCH_FAILURE = 'ARTIST_SEARCH_FAILURE';
export const RELATED_ARTISTS_REQUEST = 'RELATED_ARTISTS_REQUEST';
export const RELATED_ARTISTS_SUCCESS = 'RELATED_ARTISTS_SUCCESS';
export const RELATED_ARTISTS_FAILURE = 'RELATED_ARTISTS_FAILURE';
export const REMOVE_RELATED_ARTISTS = 'REMOVE_RELATED_ARTISTS';

// reducers
function search(state = [], action) {
  switch (action.type) {
    case ARTIST_SEARCH_SUCCESS:
      return {
        results: action.payload.artists.items
      };
    default:
      return state;
  }
}

function forceData(state = {}, action) {
  switch (action.type) {
    case RELATED_ARTISTS_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case REMOVE_RELATED_ARTISTS:
      return {};
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
export const requestArtists = query => (dispatch, getState) => {
  const state = getState();
  dispatch({
    type: ARTIST_SEARCH_REQUEST
  });

  fetch(
    `https://api.spotify.com/v1/search?q=${helpers.fixedEncodeURIComponent(query)}&type=artist`,
    { headers: { Authorization: 'Bearer ' + state.auth.access_token } }
  )
    .then(res => res.json())
    .then((json) => {
      dispatch({
        type: ARTIST_SEARCH_SUCCESS,
        payload: json
      });
    })
    .catch((err) => {
      console.error('Request failed', err);
      dispatch({
        type: ARTIST_SEARCH_FAILURE,
        payload: err
      });
    });
};

export const requestRelatedArtists = id => (dispatch, getState) => {
  const state = getState();
  dispatch({
    type: RELATED_ARTISTS_SUCCESS
  });

  fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
    headers: { Authorization: 'Bearer ' + state.auth.access_token }
  })
    .then(res => res.json())
    .then((json) => {
      const computedForceData = helpers.handleRelatedRes(id, json, state);
      dispatch({
        type: RELATED_ARTISTS_SUCCESS,
        payload: computedForceData
      });
      dispatch(hideResults());
    })
    .catch((err) => {
      console.error('Request failed', err);
      dispatch({
        type: RELATED_ARTISTS_FAILURE,
        payload: err
      });
    });
};

export const newRleatedArtists = id => (dispatch) => {
  dispatch({
    type: REMOVE_RELATED_ARTISTS
  });
  dispatch(requestRelatedArtists(id));
};
