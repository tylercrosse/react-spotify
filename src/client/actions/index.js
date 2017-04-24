import helpers from '../utils/helpers';

export function selectResult(result) {
  return (dispatch) => {
    dispatch(requestRelatedArtists(result.id));
  };
}

export function requestValidation() {
  return (dispatch) => {
    fetch('auth/validate', {credentials: 'include'})
      .then(res => res.json())
      .then((json) => {
        dispatch({
          type: 'REQUEST_VALIDATION',
          payload: json
        });
      });
      // .catch((err) => {console.log('Request failed', err)})
  };
}

export function hideResults() {
  return {
    type: 'HIDE_RESULTS'
  };
}

export function requestArtists(query) {
  return (dispatch, getState) => {
    const state = getState();
    fetch(`https://api.spotify.com/v1/search?q=${helpers.fixedEncodeURIComponent(query)}&type=artist`, {headers: {Authorization: 'Bearer ' + state.auth.access_token}})
      .then(res => res.json())
      .then((json) => {
        dispatch({
          type: 'REQUEST_ARTISTS',
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
        const forceData = helpers.handleRelatedRes(id, json, state);
        dispatch({
          type: 'REQUEST_RELATED_ARTISTS',
          forceData
        });
        dispatch(hideResults());
      });
      // .catch((err) => {console.log('Request failed', err)})
  };
}

export function d3dblclick(node) {
  return (dispatch) => {
    dispatch(requestRelatedArtists(node.id));
  };
}

export function d3mouseover(node, event) {
  node.clientX = event.clientX; // eslint-disable-line no-param-reassign
  node.clientY = event.clientY; // eslint-disable-line no-param-reassign
  return (dispatch) => {
    dispatch({
      type: 'D3_MOUSE_OVER',
      node,
    });
  };
}

export function d3mouseout(node) {
  return (dispatch) => {
    dispatch({
      type: 'D3_MOUSE_OUT',
      node
    });
  };
}
