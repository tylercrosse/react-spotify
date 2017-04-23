export default function auth(state = {}, action) {
  switch (action.type) {
    case 'REQUEST_VALIDATION':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        access_token: action.payload.access_token,
        userData: action.payload.user
      };
    default:
      return state;
  }
}
