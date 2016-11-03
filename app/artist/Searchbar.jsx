import React from 'react';

export default class Searchbar extends React.Component {
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
    this.props.onSearchSubmit(this.state.artistSearch);
    this.handleX()
  }
  handleX(e) {
    this.setState({
      artistSearch: ''
    })
  }
  render() {
    return (
      <form className="search" 
        onSubmit={(e) => this.handleArtistSearch(e)}
      >
        <div>
          <button className="mag" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497.938 430.062l-62.28-62.28c-18.156 26.655-41.22 49.72-67.875 67.875l62.28 62.28c18.75 18.75 49.156 18.75 67.875 0 18.75-18.75 18.75-49.125 0-67.875zM448 224C448 100.28 347.72 0 224 0S0 100.28 0 224s100.28 224 224 224 224-100.28 224-224zM224 400c-97.047 0-176-78.97-176-176 0-97.047 78.953-176 176-176 97.03 0 176 78.953 176 176 0 97.03-78.97 176-176 176z"/></svg>
          </button>
          <input 
            type="text" 
            value={this.state.artistSearch} 
            placeholder="Artist Search"
            onChange= {(e) => this.updateNewSearch(e)} 
          />
          {this.state.artistSearch ? 
            <button className="x"
              onClick={(e) => this.handleX(e)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220.176 220.176"><path d="M131.577 110.084l84.176-84.146c5.897-5.928 5.897-15.565 0-21.492-5.928-5.928-15.595-5.928-21.492 0l-84.175 84.146L25.938 4.446c-5.928-5.928-15.565-5.928-21.492 0s-5.928 15.565 0 21.492l84.146 84.146L4.446 194.26c-5.928 5.897-5.928 15.565 0 21.492 5.928 5.897 15.565 5.897 21.492 0l84.146-84.176 84.176 84.176c5.897 5.897 15.565 5.897 21.492 0 5.897-5.928 5.897-15.595 0-21.492l-84.175-84.176z"/></svg>
            </button> : null}
        </div>
      </form>
    )
  }
}