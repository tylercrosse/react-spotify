import { combineReducers } from 'redux';
import auth from './auth';
import artist from './artist';
import ui from './ui';

const rootReducer = combineReducers({
  auth,
  artist,
  ui
});

export default rootReducer;
