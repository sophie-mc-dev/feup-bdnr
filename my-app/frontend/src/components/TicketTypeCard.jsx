import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import Loading from "./Loading";

const TicketTypeCard = ({ ticket, event_date, event_id, event_name }) => {
  const { isLoggedIn, user } = useContext(UserContext);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);


  const handleAddToCartClick = async() => {
    setIsLoadingOpen(true);
    try{
      await axios.post(`http://localhost:3000/transactions/shopping_cart/`, 
      {
        user_id: user.user_id, 
        item: {
          event_id: event_id,
          event_name: event_name,
          event_date: event_date,
          ticket_type: ticket.ticket_type,
          ticket_price: ticket.price
        }
      });
      setIsLoadingOpen(false);
      setIsConfirmationOpen(true);
    } catch (err) {
      console.error("Error adding item to cart:", err);
      setIsLoadingOpen(false);
    }
  };

  const handleCloseModalClick = () => {
    setIsConfirmationOpen(false);
  }

  return (
    <>
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
          {isLoggedIn && !user.is_organization && event_date >= new Date().toISOString().slice(0, 19) && (
            <button onClick={handleAddToCartClick} className="bg-[#494391] text-white font-medium text-base rounded-lg px-4 py-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
    {isLoadingOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white w-1/4 py-8 items-center rounded-md shadow-md">
            <Loading/>
        </div>
      </div>
    )}

    {isConfirmationOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="flex flex-col justify-center w-1/4 gap-y-8 bg-white py-6 rounded-md shadow-md">
          <p className="text-center">Item added to cart</p>
          <div className="flex justify-center">
            <button onClick={handleCloseModalClick} className="w-1/4 bg-[#242565] hover:bg-[#494391] text-white font-medium text-sm rounded-lg px-4 py-2 cursor-pointer items-center">
              Close
            </button>
          </div>
      </div>
    </div>
    )}
    
    </>
  );
};

export default TicketTypeCard;
