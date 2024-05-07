import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import { UserContext } from "../contexts/UserContext";
import Loading from "../components/Loading";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user.is_organization) {
      navigate("/");
    } else {
      // fetch
    }
  }, []);

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="organization" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h3 className="text-2xl font-bold mb-6">My Analytics</h3>

        <section className="grid">
          <h3 className="text-xl font-semibold mb-5">Total Income</h3>
        </section>
        <section className="grid">
          <h3 className="text-xl font-semibold mb-5">Best Selling Event</h3>
        </section>
        <section className="grid">
          <h3 className="text-xl font-semibold mb-5">
            Total Events Hosted
          </h3>
        </section>
        <section className="grid">
          <h3 className="text-xl font-semibold mb-5">
            Ticket Sales by Event Type
          </h3>
        </section>
        <section className="grid">
          <h3 className="text-xl font-semibold mb-5">
            Revenue by Ticket Type
          </h3>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;
