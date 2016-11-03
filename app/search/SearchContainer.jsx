import React                  from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux'
import Searchbar    from './Searchbar.jsx'
import ResultsList  from './ResultsList.jsx'
import * as Actions from '../actions/';
import                   './search.scss';

class SearchContainer extends React.Component {
  render() {
    return (
      <div>
        <Searchbar 
          onSearchSubmit={this.props.actions.requestArtists}
        />
        {this.props.showResults &&
        <ResultsList results={this.props.results}
          onResultSelect={this.props.actions.selectResult}
        />}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    showResults: state.search.showResults,
    results: state.search.results
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer);