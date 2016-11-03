import React  from 'react';
import Result from './Result.jsx'

export default function ResultsList(props) {
  const resultItems = props.results.map((data, index) => (
    <Result 
      key={data.id}
      data={data} 
      onResultSelect={props.onResultSelect}
    />
  ))
  return (
    <div className='artist-list'>
      <span>Artists</span>
      {resultItems}
    </div>
  )
}