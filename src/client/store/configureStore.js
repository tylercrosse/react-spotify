import {
  createStore,
  compose,
  applyMiddleware } from 'redux';
import thunk        from 'redux-thunk';
import rootReducer  from '../ducks';

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
  );

  if (module.hot) {
    module.hot.accept('../ducks', () => {
      const nextRootReducer = require('../ducks').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
