import React from "react";

const ShoppingCartCard = ({ item, removeItem, updateQuantity }) => {
  return (
    <div className="flex flex-col gap-y-2 mt-3 bg-gray-100 rounded-lg shadow-lg p-4">
      <div className="flex flex-row justify-between">
        <p className="text-md font-bold">{item.event_name}</p>
        <button onClick={() => removeItem(item.id)} className="text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-row justify-between items-end">
        <span className="flex-gow-1 bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-600 mr-2 mb-2">
            {item.ticket_type}
          </span>
        <div className="flex items-center">
          <button
            onClick={() => updateQuantity(item.id, -1)}
            className="text-gray-500 mr-2"
          >
            <svg
              className="h-4 w-4 text-violet-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <p className="mr-2">{item.quantity}</p>
          <button
            onClick={() => updateQuantity(item.id, 1)}
            className="text-gray-500"
          >
            <svg
              className="h-4 w-4 text-violet-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <p className="ml-5 text-md font-medium">
            ${item.ticket_price * item.quantity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartCard;
