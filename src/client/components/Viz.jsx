import React                  from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import { Link }               from 'react-router';
import { hideResults }        from '../ducks/ui';
import { requestValidation }  from '../ducks/auth';
import Login                  from './user/Login.jsx';
import LoggedIn               from './user/LoggedIn.jsx';
import Search                 from './search/Search.jsx';
import ForceTree              from './viz/ForceTree.jsx';
import NodeDetails            from './viz/NodeDetails.jsx';
import                             './global.scss';

class Viz extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    window.addEventListener('click', this.handleClick, false);

    this.props.requestValidation();
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick, false);
  }
  handleClick(e) {
    if (this.props.showResults) {
      const area = ReactDOM.findDOMNode(this.results);
      if (!area.contains(e.target)) {
        this.props.hideResults();
      }
    }
  }
  render() {
    if (!this.props.userData) {
      return (
        <Login />
      );
    }
    return (
      <div>
        <div className="nav">
          <Search ref={(c) => { this.results = c; }} />
          <Link to="/about">About</Link>
          <Link to="/animation">Animation</Link>
          <LoggedIn userData={this.props.userData} />
        </div>
        {(Object.keys(this.props.forceData).length > 0) &&
          <ForceTree />}
        {this.props.hoveredNode &&
          <NodeDetails />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    forceData: state.artist.forceData,
    access_token: state.auth.access_token,
    userData: state.auth.userData,
    showResults: state.ui.showResults,
    hoveredNode: state.ui.hoveredNode
  };
}

export default connect(
  mapStateToProps,
  { hideResults, requestValidation }
)(Viz);
