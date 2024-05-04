import "../index.css";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const EventPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);

  useEffect(() => {
    if (id) { 
      fetchEventInfo(id); 
    }
  }, [id]);

  const fetchEventInfo = async (id) => {
    try {
      const response = await axios.get("http://localhost:3000/events/"+ id);
      setEventInfo(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-6">{eventInfo.event_name}</h2>
          <p>Description: {eventInfo.description}</p>
          <p>Categories: {eventInfo.categories.join(", ")}</p>
          <p>Location: {eventInfo.location}</p>
          <p>Date: {eventInfo.date}</p>
          <p>Address: {eventInfo.address}</p>
          <p>Number of Likes: {eventInfo.num_likes}</p>
      
          <h3 className="mt-5">Ticket Types:</h3>
          {eventInfo.ticket_types.map((ticket, index) => (
            <div className="p-4" key={index}>
              <p>Ticket Type: {ticket.ticket_type}</p>
              <p>Price: {ticket.price}</p>
              <p>Available Tickets: {ticket.available_tickets}</p>
            </div>
          ))}
      
        </div>
        ) }
    </div>
  );
};

export default EventPage;