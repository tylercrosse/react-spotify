export default function forceData(state = {}, action) {
  switch (action.type) {
    case 'REQUEST_RELATED_ARTISTS':
      return {
        ...state,
        ...action.forceData
      };
    default:
      return state;
  }
}
