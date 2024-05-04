import React from "react";

const PurchaseCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex max-w-s">
      {/* Details container */}
      <div className="flex-grow p-4">
        <div className="mb-1">
          <a className="text-lg font-bold" href={`/events/${item.event_id}`}>
            {item.event_name}
          </a>
        </div>

        <span className=" bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-600 mr-2 mb-2">
          {item.ticket_type}
        </span>

        {/* Quantity and Price */}
        <div className="flex justify-end items-center gap-5">
          <span className="text-xs text-gray-500">
            Quantity: {item.quantity}
          </span>
          <span className="text-xs text-gray-500">
            Total: ${item.ticket_price * item.quantity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;
