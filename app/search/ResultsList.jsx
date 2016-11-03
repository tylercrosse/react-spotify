import React  from 'react';
import Result from './Result.jsx'

export default function ResultsList({ results, onResultSelect }) {
  const resultItems = results.map((result, index) => (
    <Result 
      key={result.id}
      result={result} 
      onResultSelect={onResultSelect}
    />
  ))
  return (
    <div className='results-list'>
      <span>Artists</span>
      {resultItems}
    </div>
  )
}