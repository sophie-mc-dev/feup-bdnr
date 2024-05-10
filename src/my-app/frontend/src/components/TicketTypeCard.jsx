import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const TicketTypeCard = ({ ticket, event_date, event_id, event_name }) => {
  const { isLoggedIn, user } = useContext(UserContext);

  const handleAddToCartClick = () => {
    if (isLoggedIn) {
      // Add to cart logic here...
      console.log("add to cart");
    } else {
      alert("Please log in first!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex max-w-full">
      <div className="flex-grow py-4 px-6 flex items-center justify-between">
        {/* Ticket Type */}
        <div className="flex items-center">
          <p className="text-gray-600 font-semibold">
            {ticket.ticket_type}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-x-3">
          <p className=" text-gray-600">${ticket.price}</p>

          {/* Button to add to cart */}
          {isLoggedIn && !user.is_organization && (
            <button onClick={handleAddToCartClick} className="bg-[#494391] text-white font-medium text-base rounded-lg px-4 py-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketTypeCard;
