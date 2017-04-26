// actions
export const VALIDATION_REQUEST = 'VALIDATION_REQUEST';
export const VALIDATION_SUCCESS = 'VALIDATION_SUCCESS';
export const VALIDATION_FAILURE = 'VALIDATION_FAILURE';

// reducers
export default function auth(state = {}, action) {
  switch (action.type) {
    case VALIDATION_SUCCESS:
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
export const requestValidation = () => (dispatch) => {
  dispatch({
    type: VALIDATION_REQUEST
  });
  fetch('auth/validate', {credentials: 'include'})
    .then(res => res.json())
    .then((json) => {
      dispatch({
        type: VALIDATION_SUCCESS,
        payload: json
      });
    })
    .catch((err) => {
      console.error('Request failed', err);
      dispatch({
        type: VALIDATION_FAILURE,
        payload: err
      });
    });
};
