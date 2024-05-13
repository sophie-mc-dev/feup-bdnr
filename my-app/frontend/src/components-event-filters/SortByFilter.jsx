// SortByFilter.js
import React from 'react';

const SortByFilter = ({ name, value, onChange }) => {
  return (
    <select
      className="select select-bordered max-w-xs text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="date">Date (ascending)</option>
      <option value="price_asc">Price (ascending)</option>
      <option value="price_desc">Price (descending)</option>
      <option value="popularity">Popularity</option>
    </select>
  );
};

export default SortByFilter;
