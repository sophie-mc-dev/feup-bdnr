// DatePicker.js
import "../index.css";
import React from 'react';

const DatePicker = ({ name, onChange }) => {
  return (
    <input
      className="text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
      name={name}
      type="date"
      onChange={onChange}
    />
  );
};

export default DatePicker;
