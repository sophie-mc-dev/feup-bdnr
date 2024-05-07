import "../index.css";
import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import { UserContext } from "../contexts/UserContext";
import Loading from "../components/Loading";

const OrganizationEventsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [isLoadingPast, setIsLoadingPast] = useState(true);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [pastEvents, setPastEvents] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState(null);

  useEffect(() => {
    if (!user.is_organization) {
      navigate('/');
    } else {
      fetchPastEvents();
      fetchUpcomingEvents();
    }
  }, []);

  const fetchPastEvents = async () => {
    setIsLoadingPast(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/events/my_events/past/" + user.user_id
      );
      setPastEvents(response.data);
      setIsLoadingPast(false);
    } catch (error) {
      setIsLoadingPast(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchUpcomingEvents = async () => {
    setIsLoadingUpcoming(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/events/my_events/upcoming/" + user.user_id
      );
      setUpcomingEvents(response.data);
      setIsLoadingUpcoming(false);
    } catch (error) {
      setIsLoadingUpcoming(false);
      console.error("Error fetching data:", error);
    }
  };

  const outputPastInfo = (event, index) => {
    return (
      <div className="flex-1 flex">
        <div
          key={index}
          className="pr-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <EventCard event={event}></EventCard>
        </div>
      </div>
    );
  }

  const outputUpcomingInfo = (event, index) => {
    return (
      <div className="flex-1 flex">
        <div
          key={index}
          className="pr-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <EventCard event={event}></EventCard>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="organization" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-6">My events</h2>

        <section className="grid">
          <h3 className="text-xl font-semibold mb-5">Upcoming Events</h3>
          <div className="pr-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {isLoadingUpcoming ? (
              <Loading />
            ) : upcomingEvents.length === 0 ? (
              <p className="text-center">No events found.</p>
            ) : (
              upcomingEvents.map((event, index) => (
                outputUpcomingInfo(event, index)
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold pt-20 mb-5">Past Events</h3>
          <div className="pr-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {isLoadingPast ? (
              <Loading />
            ) : pastEvents.length === 0 ? (
              <p>No events found.</p>
            ) : (
              pastEvents.map((event, index) => (
                outputPastInfo(event, index)
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrganizationEventsPage;
