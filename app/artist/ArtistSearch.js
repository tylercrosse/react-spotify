import React from 'react';

export default class ArtistSearch extends React.Component {
  constructor() {
    super()
    this.state = {
      artistSearch: ''
    }
  }
  updateNewSearch(e) {
    this.setState({
      artistSearch: e.target.value
    });
  }
  handleArtistSearch(e) {
    e.preventDefault();
    this.props.newSearch(this.state.artistSearch);
    this.setState({
      artistSearch: ''
    })
  }
  render() {
    return (
      <form className="search" onSubmit={(e) => this.handleArtistSearch(e)}>
        <input 
          type="text" 
          value={this.state.artistSearch} 
          placeholder="Artist Search"
          onChange= {(e) => this.updateNewSearch(e)} />
        <button type="submit" className="btn">Search</button>
      </form>
    )
  }
}