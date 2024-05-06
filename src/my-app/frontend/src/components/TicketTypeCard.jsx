import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const TicketTypeCard = ({ ticket }) => {
  const { isLoggedIn, user } = useContext(UserContext);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex max-w-full">
      <div className="flex-grow p-4 flex items-center justify-between">
        {/* Ticket Type */}
        <div className="flex items-center">
          <p className="text-sm text-gray-600 font-semibold">
            {ticket.ticket_type}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center">
          <p className="text-sm text-gray-600">${ticket.price}</p>
        </div>

        {/* Available Tickets */}
        <div className="flex items-center">
          <p className="text-sm text-gray-600">
            Available Tickets: {ticket.available_tickets}
          </p>
        </div>

        {/* Button to add to cart */}
        {isLoggedIn && !user.is_organization && (
          <button className="bg-[#494391] text-white font-semibold text-base rounded-lg px-4 py-2 font-500 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketTypeCard;
