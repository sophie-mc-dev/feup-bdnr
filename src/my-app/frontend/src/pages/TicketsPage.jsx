import "../index.css";
import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import Sidebar from "../components/Sidebar";

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
    <div className="flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h2 className="text-2xl font-semibold mb-6">My Tickets</h2>

        <section>
          <h3 className="text-xl font-semibold mb-3">Upcoming Events</h3>
          <div className="grid gap-4">
            {isLoadingUpcoming ? (
              <Loading />
            ) : upcomingTickets.length === 0 ? (
              <p>No tickets found.</p>
            ) : (
              upcomingTickets.map((ticket, index) => (
                <div key={index} className="p-4 rounded-lg bg-white shadow">
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
          <div className="grid gap-4">
            {isLoadingPast ? (
              <Loading />
            ) : pastTickets.length === 0 ? (
              <p>No tickets found.</p>
            ) : (
              pastTickets.map((ticket, index) => (
                <div key={index} className="p-4 rounded-lg bg-white shadow">
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
    </div>
  );
};

export default TicketsPage;
