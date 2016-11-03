import React                  from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions       from './actions';
import Login              from './user/Login.jsx';
import LoggedIn           from './user/LoggedIn.jsx';
import SearchContainer    from './search/SearchContainer.jsx';
import ForceTreeContainer from './viz/ForceTreeContainer.jsx';
import                      './global.scss';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    window.addEventListener('click', this.handleClick, false);
    
    this.props.actions.requestValidation();
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick, false)
  }
  handleClick(e) {
    if (this.props.showResults) {
      const area = ReactDOM.findDOMNode(this.refs.results);
      if (!area.contains(e.target)) {
        this.props.actions.hideResults();
      }
    }
  }
  render() {
    if (!this.props.userData) {
      return (
        <Login />
      )
    }
    return (
      <div>
        <div className="nav">
          <SearchContainer ref='results' />
          <LoggedIn userData={this.props.userData} />
        </div>
        {(Object.keys(this.props.forceData).length > 0) &&
        <ForceTreeContainer />}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    forceData: state.forceData,
    access_token: state.auth.access_token,
    userData: state.auth.userData,
    showResults: state.search.showResults
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
