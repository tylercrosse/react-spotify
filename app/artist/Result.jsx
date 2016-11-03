import React from 'react';

export default function Result({ result, onResultSelect }) {
  let image;
  if (result.images.length > 0) {
    image = (
      <img src={result.images[0].url} alt="profile image" />
    )
  } 
  else {
    image = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.58 277.58">
      <path d="M138.5 164.3c-38.7 0-70-37.5-70-83.8 0-46.2 31.3-80.5 70-80.5 38.6 0 70 34.3 70 80.5 0 46.3-31.4 83.8-70 83.8zM29.7 277.5s-14.8 1-21.4-8c-3.5-5-1-14.7 1.4-20.2l6-13.5s16.2-36.6 34.8-57.7c11.5-13 25-10 34-5.8 5.3 2.6 11.4 10.2 16 14.2 6 5.6 17 12 34.7 12.2h11c17.8-.3 28.6-6.6 34.8-12.2 4.5-4 10.4-11.8 15.8-14.5 8-4 20.4-6.6 31.5 6 18.6 21.2 33.4 58.5 33.4 58.5l6 13.2c2.5 5.5 5 15.3 1.7 20.2-6.2 8.7-20 7.5-20 7.5H29.8z"/>
      </svg>
    )
  }
  return (
    <div 
      className="artist-card" 
      onClick={() => onResultSelect(result)}
    >
      {image}
      <span>{result.name}</span>
    </div>
  )
}