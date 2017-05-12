import React    from 'react';
import { Link } from 'react-router';

const Generic404 = () => (
  <div className="generic404">
    <h1>404</h1>
    <p>Sorry, this page does not exist,</p>
    <Link to="/">try going home.</Link>
  </div>
);

export default Generic404;
