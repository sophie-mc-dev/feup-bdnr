import React from "react";

const EventCard = ({ month, day, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex max-w-xs">
      {/* Left container for month and day */}
      <div className="flex flex-col items-center justify-center bg-gray-200 p-4">
        <div className="text-xl font-bold">{month}</div>
        <div className="text-3xl font-bold">{day}</div>
      </div>

      {/* Right container for event details */}
      <div className="flex-grow p-4">
        <div className="text-lg font-bold mb-2">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
};

export default EventCard;
