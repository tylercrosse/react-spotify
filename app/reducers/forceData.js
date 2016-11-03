export default function forceData(state = {}, action) {
  switch (action.type) {
    case 'REQUEST_RELATED_ARTISTS':
      return {
        ...state,
        forceData: action.forceData
      }
  default:
    return state;
  }
}