import { combineReducers } from 'redux';
import { REQUEST_ARTISTS } from './artist';

// actions
export const NODE_MOUSE_OVER = 'NODE_MOUSE_OVER';
export const NODE_MOUSE_OUT = 'NODE_MOUSE_OUT';
export const HIDE_RESULTS = 'HIDE_RESULTS';

// reducers
function hoveredNode(state = null, action) {
  switch (action.type) {
    case NODE_MOUSE_OVER:
      return action.node;
    case NODE_MOUSE_OUT:
      return null;
    default:
      return state;
  }
}

function showResults(state = false, action) {
  switch (action.type) {
    case REQUEST_ARTISTS:
      return true;
    case HIDE_RESULTS:
      return false;
    default:
      return state;
  }
}

const ui = combineReducers({
  hoveredNode,
  showResults
});

export default ui;

// action creators
export function hideResults() {
  return {
    type: HIDE_RESULTS
  };
}

export function nodeMouseOver(node, event) {
  node.clientX = event.clientX; // eslint-disable-line no-param-reassign
  node.clientY = event.clientY; // eslint-disable-line no-param-reassign
  return (dispatch) => {
    dispatch({
      type: NODE_MOUSE_OVER,
      node,
    });
  };
}

export function nodeMouseOut(node) {
  return (dispatch) => {
    dispatch({
      type: NODE_MOUSE_OUT,
      node
    });
  };
}
