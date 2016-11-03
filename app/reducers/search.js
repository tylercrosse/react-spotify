const initialState = {
  results: [],
  showResults: false
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case 'REQUEST_ARTISTS':
      return {
        ...state,
        results: action.payload.artists.items,
        showResults: true
      };
    case 'TOGGLE_RESULTS':
      return {
        ...state,
        showResults: !state.showResults
      }
    default:
      return state;
  }
}