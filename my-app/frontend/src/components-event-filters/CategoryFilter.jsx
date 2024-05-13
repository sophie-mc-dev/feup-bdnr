// CategoryFilter.js
import "../index.css";
import React from 'react';

const CategoryFilter = ({ name, value, options, onChange }) => {
  return (
    <select
      className="select select-bordered max-w-xs text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">All Categories</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;