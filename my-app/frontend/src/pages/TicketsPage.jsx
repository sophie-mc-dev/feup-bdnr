import "../index.css";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";
import TicketCard from "../components/TicketCard";

const TicketsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isLoadingPast, setIsLoadingPast] = useState(true);
  const [upcomingTickets, setUpcomingTickets] = useState([]);
  const [pastTickets, setPastTickets] = useState([]);

  useEffect(() => {
    if (user.is_organization) {
      navigate('/');
    } else {
      fetchTUpcomingTickets();
      fetchPastTickets();
    }
  }, []);

  const fetchTUpcomingTickets = async () => {
    try {
      let res = await axios.get(
        "http://localhost:3000/transactions/tickets/upcoming/" + user.user_id
      );
      setUpcomingTickets(res.data);
      setIsLoadingUpcoming(false);
    } catch (error) {
      setIsLoadingUpcoming(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchPastTickets = async () => {
    try {
      let res = await axios.get(
        "http://localhost:3000/transactions/tickets/past/" + user.user_id
      );
      setPastTickets(res.data);
      setIsLoadingPast(false);
    } catch (error) {
      setIsLoadingPast(false);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-6">My Tickets</h2>

        <section className="grid">
          <h3 className="text-xl font-semibold mb-5">Upcoming Events</h3>
          <div className="flex flex-wrap gap-5 mb-6">
            {isLoadingUpcoming ? (
              <div className="flex w-full justify-center">
              <Loading />
              </div>
            ) : upcomingTickets.length === 0 ? (
              <p>No tickets found.</p>
            ) : (
              upcomingTickets.map((ticket, index) => (
                <div key={index}>
                  <TicketCard
                    event_ID={ticket.event_id}
                    event_name={ticket.event_name}
                    date={ticket.event_date}
                    ticket_type={ticket.ticket_type}
                    quantity={ticket.quantity}
                  ></TicketCard>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mt-2 mb-5">Past Events</h3>
          <div className="flex flex-wrap gap-5 mb-6">
            {isLoadingPast ? (
               <div className="flex w-full justify-center">
              <Loading />
              </div>
            ) : pastTickets.length === 0 ? (
              <p>No tickets found.</p>
            ) : (
              pastTickets.map((ticket, index) => (
                <div key={index}>
                  <TicketCard
                    event_ID={ticket.event_id}
                    event_name={ticket.event_name}
                    date={ticket.event_date}
                    ticket_type={ticket.ticket_type}
                    quantity={ticket.quantity}
                  ></TicketCard>
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
