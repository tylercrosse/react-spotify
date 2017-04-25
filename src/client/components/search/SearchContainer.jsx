import React                  from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import Searchbar              from './Searchbar.jsx';
import ResultsList            from './ResultsList.jsx';
import { requestRelatedArtists,
  requestArtists } from '../../ducks/artist';

import                             './search.scss';

function SearchContainer(props) {
  return (
    <div>
      <Searchbar
        onSearchSubmit={props.actions.requestArtists}
      />
      {props.showResults &&
        <ResultsList
          results={props.results}
          onResultSelect={props.actions.requestRelatedArtists}
        />}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    showResults: state.ui.showResults,
    results: state.artist.search.results
  };
}

const Actions = {
  requestRelatedArtists,
  requestArtists
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer);
