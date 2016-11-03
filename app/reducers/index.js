import { combineReducers } from 'redux';
import auth      from './auth';
import search    from './search';
import forceData from './forceData'

const rootReducer = combineReducers({
  auth,
  search,
  forceData
})

export default rootReducer;
