import React                  from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import Searchbar    from './Searchbar.jsx';
import ResultsList  from './ResultsList.jsx';
import * as Actions from '../actions/';
import                   './search.scss';

function SearchContainer(props) {
  return (
    <div>
      <Searchbar
        onSearchSubmit={props.actions.requestArtists}
      />
      {props.showResults &&
        <ResultsList
          results={props.results}
          onResultSelect={props.actions.selectResult}
        />}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    showResults: state.search.showResults,
    results: state.search.results
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer);
