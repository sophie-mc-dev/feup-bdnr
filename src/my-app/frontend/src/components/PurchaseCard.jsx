import React from "react";

const PurchaseCard = ({ event_name, ticket_type, ticket_price, quantity }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex max-w-s">
      {/* Details container */}
      <div className="flex-grow p-4">
        <div className="text-lg font-bold mb-1">{event_name}</div>
        <span className=" bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-600 mr-2 mb-2">
          {ticket_type}
        </span>

        {/* Quantity and Price */}
        <div className="flex justify-end items-center gap-5">
          <span className="text-xs text-gray-500">Quantity: {quantity}</span>
          <span className="text-xs text-gray-500">
            Total: ${ticket_price * quantity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;
