const initialState = {
  hoveredNode: null
};

export default function hoveredNode(state = initialState, action) {
  switch (action.type) {
    case 'D3_MOUSE_OVER':
      return {
        ...state,
        hoveredNode: action.node
      };
    case 'D3_MOUSE_OUT':
      return {
        ...state,
        hoveredNode: null
      };
    default:
      return state;
  }
}
