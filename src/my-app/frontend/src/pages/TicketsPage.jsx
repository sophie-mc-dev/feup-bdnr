import "../index.css";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";

const TicketsPage = () => {
  const { user } = useContext(UserContext);

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
      let res = await axios.get("http://localhost:3000/transactions/tickets/upcoming/"+user.user_id);
      setUpcomingTickets(res.data);
      setIsLoadingUpcoming(false);
    } catch (error) {
      setIsLoadingUpcoming(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchPastTickets = async () => {
    try {
      let res = await axios.get("http://localhost:3000/transactions/tickets/past/"+user.user_id);
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

      <div className="flex-1 overflow-y-auto bg-gray-100 pl-10 pt-5">
        <h2 className="text-2xl font-semibold mb-5">My Tickets</h2>

        <section className="grid">
          <h3 className="text-xl font-semibold mb-5">Upcoming Events</h3>
          <div className="pr-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoadingUpcoming ? (
              <Loading />
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
          <h3 className="text-xl font-semibold pt-20 mb-5">Past Events</h3>
          <div className="pr-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoadingPast ? (
              <Loading />
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
