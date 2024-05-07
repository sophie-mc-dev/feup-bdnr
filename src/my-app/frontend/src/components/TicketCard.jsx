import React from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${month} ${day}, ${year} at ${hours}h${minutes}`;
};

const TicketCard = ({ event_ID, event_name, date, ticket_type, quantity }) => {
  const formattedDate = formatDate(date);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[180px] w-[250px] flex flex-wrap max-w-sm">
      {/* Details container */}
      <div className="flex-grow p-4">

        <div className="text-lg font-bold mb-1">
          <a href={`/events/${event_ID}`}>{event_name}</a>
        </div>
        <div className="flex flex-wrap">
          <span className=" bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-600 mr-2 mb-2">
            {ticket_type}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-gray-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <line x1="16" y1="3" x2="16" y2="7" />
            <line x1="8" y1="3" x2="8" y2="7" />
            <line x1="4" y1="11" x2="20" y2="11" />
            <line x1="11" y1="15" x2="12" y2="15" />
            <line x1="12" y1="15" x2="12" y2="18" />
          </svg>
          {formattedDate}
        </div>

        {/* Quantity and Price */}
        <div className="flex justify-end items-center gap-5">
          <span className="text-xs text-gray-500">Quantity: {quantity}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
