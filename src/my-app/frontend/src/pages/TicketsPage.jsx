import React, { useState } from "react";

const TicketsPage = () => {

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Tickets</h2>

      <section>
        <h3 className="text-xl font-semibold mb-3">Upcoming Events</h3>
        <div className="grid grid-cols-2 gap-4">

        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">Past Events</h3>
        <div className="grid grid-cols-2 gap-4">
          
        </div>
      </section>
    </div>
  );
};

export default TicketsPage;
