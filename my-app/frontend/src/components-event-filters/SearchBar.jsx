import "../index.css";
import React from 'react';

const SearchBar = ({ value, onChange }) => {
    return (
        <input
            className="text-base text-gray-400 flex-grow outline-none px-2"
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Search event or artist name"
        />
    );
};

export default SearchBar;