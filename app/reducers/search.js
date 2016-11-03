const initialState = {
  results: []
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case 'REQUEST_ARTISTS':
      return {
        ...state,
        results: action.payload.artists.items
      };
    default:
      return state;
  }
}