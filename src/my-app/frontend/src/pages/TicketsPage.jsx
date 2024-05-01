import "../index.css";
import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import axios from "axios";

// TODO: use login logic to set the following data
const isLoggedIn = true;
const userInfo = {
  id: "10",
  is_organization: false
};

const TicketsPage = () => {
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isLoadingPast, setIsLoadingPast] = useState(true);
  const [upcomingTickets, setUpcomingTickets] = useState([]);
  const [pastTickets, setPastTickets] = useState([]);

  useEffect(() => {
    fetchTUpcomingTickets();
    fetchPastTickets();
  }, []);

  const fetchTUpcomingTickets = async () => {
    try {
      let res = await axios.get("http://localhost:3000/transactions/tickets/upcoming/"+userInfo.id);
      setUpcomingTickets(res.data);
      setIsLoadingUpcoming(false);
    } catch (error) {
      setIsLoadingUpcoming(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchPastTickets = async () => {
    try {
      let res = await axios.get("http://localhost:3000/transactions/tickets/past/"+userInfo.id);
      setPastTickets(res.data);
      setIsLoadingPast(false);
    } catch (error) {
      setIsLoadingPast(false);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Tickets</h2>

      <section>
        <h3 className="text-xl font-semibold mb-3">Upcoming Events</h3>
        <div className="flex flex-col gap-y-5">
          {isLoadingUpcoming ? (
            <Loading />
          ) : upcomingTickets.length === 0 ? (
            <p>No tickets found.</p>
          ) : (
            upcomingTickets.map((ticket, index) => (
              <div key={index} className="flex flex-col rounded-lg gap-y-5 px-7 py-5 bg-gray-200">
                  <p className="font-medium">Event ID: {ticket.event_id}</p>
                  <p className="font-medium">Event: {ticket.event_name}</p>
                  <p>Date: {ticket.event_date}</p>
                  <p>Ticket Type: {ticket.ticket_type}</p>
                  <p>Quantity: {ticket.quantity}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">Past Events</h3>
        <div className="flex flex-col gap-y-5">
          {isLoadingPast ? (
            <Loading />
          ) : pastTickets.length === 0 ? (
            <p>No tickets found.</p>
          ) : (
            pastTickets.map((ticket, index) => (
              <div key={index} className="flex flex-col rounded-lg gap-y-5 px-7 py-5 bg-gray-200">
                  <p className="font-medium">Event ID: {ticket.event_id}</p>
                  <p className="font-medium">Event: {ticket.event_name}</p>
                  <p>Date: {ticket.event_date}</p>
                  <p>Ticket Type: {ticket.ticket_type}</p>
                  <p>Quantity: {ticket.quantity}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default TicketsPage;
