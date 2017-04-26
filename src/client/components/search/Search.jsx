import React                  from 'react';
import { connect }            from 'react-redux';
import Searchbar              from './Searchbar.jsx';
import ResultsList            from './ResultsList.jsx';
import { requestRelatedArtists,
  requestArtists } from '../../ducks/artist';

import                             './search.scss';

const Search = props => (
  <div>
    <Searchbar
      onSearchSubmit={props.requestArtists}
    />
    {props.showResults &&
      <ResultsList
        results={props.results}
        onResultSelect={props.requestRelatedArtists}
      />}
  </div>
);

function mapStateToProps(state) {
  return {
    showResults: state.ui.showResults,
    results: state.artist.search.results
  };
}

export default connect(
  mapStateToProps,
  { requestRelatedArtists, requestArtists }
)(Search);
