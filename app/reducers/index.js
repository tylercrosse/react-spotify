import { combineReducers } from 'redux';
import auth      from './auth';
import search    from './search';
import forceData from './forceData'
import d3Reducer from './d3Reducer'

const rootReducer = combineReducers({
  auth,
  search,
  forceData
})

export default rootReducer;
