import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './components/App';
import About from './components/About';
import Viz from './components/Viz';
import Generic404 from './components/Generic404';

export const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Viz} />
      <Route path="about" component={About} />
    </Route>
    <Route path="*" component={Generic404} />
  </Router>
);

const Routes = () => routes;

export default Routes;
