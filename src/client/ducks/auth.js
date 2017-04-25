// actions
export const REQUEST_VALIDATION = 'REQUEST_VALIDATION';

// reducers
export default function auth(state = {}, action) {
  switch (action.type) {
    case REQUEST_VALIDATION:
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

// action creators
export function requestValidation() {
  return (dispatch) => {
    fetch('auth/validate', {credentials: 'include'})
      .then(res => res.json())
      .then((json) => {
        dispatch({
          type: REQUEST_VALIDATION,
          payload: json
        });
      });
      // .catch((err) => {console.log('Request failed', err)})
  };
}
