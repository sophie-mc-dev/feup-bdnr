// ArtistFilter.js
import React from 'react';

const ArtistFilter = ({ name, value, options, onChange }) => {
  return (
    <select
      className="select select-bordered max-w-xs text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">All Artists</option>
      {options.map((artist, index) => (
        <option key={index} value={artist}>
          {artist}
        </option>
      ))}
    </select>
  );
};

export default ArtistFilter;
