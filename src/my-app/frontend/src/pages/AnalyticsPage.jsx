import React, { useState, useContext, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import { UserContext } from "../contexts/UserContext";
import Loading from "../components/Loading";
import Chart from "chart.js/auto";
import EventAnalyticsCard from "../components/EventAnalyticsCard";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);
  const [chartColors, setChartColors] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [bestSellingEvent, setBestSellingEvent] = useState(null);
  const [totalEventsHosted, setTotalEventsHosted] = useState(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [ticketsByType, setTicketsByType] = useState([]);
  const [revenueByTicketType, setRevenueByTicketType] = useState([]);

  // get the user id from the user context
  const userId = user.user_id;

  // SAMPLE DATA FOR REVENUE DATA OF TICKET TYPES
  const revenueData = [
    { ticketType: "VIP", revenue: 1500 },
    { ticketType: "General Admission", revenue: 2500 },
    { ticketType: "Early Bird", revenue: 1000 },
  ];

  useEffect(() => {
    if (!user.is_organization) {
      navigate("/");
    } else {
      // fetch
    }
    if(userId){
      fetchTotalIncome(userId);
      fetchBestSellingEvent(userId);
      fetchTotalEventsHosted(userId);
      fetchTotalTicketsSold(userId);
      fetchTicketsByType(userId);
      fetchRevenueByTicketType(userId);
    }
  }, [userId]);

  const fetchTotalIncome = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/users/" +userId);
      setTotalIncome(response.data.total_income);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const fetchBestSellingEvent = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/users/" +userId);
      setBestSellingEvent(response.data.best_selling_event);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const fetchTotalEventsHosted = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/users/" +userId);
      setTotalEventsHosted(response.data.total_events_hosted);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const fetchTotalTicketsSold = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/users/" +userId);
      setTotalTicketsSold(response.data.total_tickets_sold);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const fetchTicketsByType = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/users/" +userId);
      setTicketsByType(response.data.tickets_sold_by_ticket_type);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const fetchRevenueByTicketType = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/users/" +userId);
      setRevenueByTicketType(response.data.revenue_by_ticket_type);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  // Generate chart colors
  useEffect(() => {
    if (ticketsByType.length > 0) {
      const numColors = ticketsByType.length;
      const colors = generateColors(numColors);
      setChartColors(colors);
    }
  }, [ticketsByType]);

  // Function to generate distinct colors
  const generateColors = (numColors) => {
    const colors = [];
    const goldenRatioConjugate = 0.618033988749895;

    for (let i = 0; i < numColors; i++) {
      const hue = (i * goldenRatioConjugate) % 1;
      const color = `hsl(${hue * 360}, 70%, 50%)`; // HSL color model
      colors.push(color);
    }

    return colors;
  };

  useEffect(() => {
    if (chartContainer.current && ticketsByType.length > 0 && chartColors.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartContainer.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ticketsByType.map(ticket => ticket.ticket_type),
          datasets: [{
            data: ticketsByType.map(ticket => ticket.quantity),
            backgroundColor: chartColors,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [ticketsByType, chartColors]);



  
  return (
    <div className="flex-1 flex">
      <Sidebar profileType="organization" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h3 className="text-2xl font-bold mb-6">My Analytics</h3>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Income */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-3">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-semibold mb-2">Total Income</h3>
              <p className="text-gray-600">${totalIncome}</p>
            </div>
          </div>

          {/* Best Selling Event */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-1">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-semibold mb-2">Best Selling Event</h3>
              {bestSellingEvent ? (
                <div>
                  <p className="text-gray-600">Name: {bestSellingEvent.event_name}</p>
                  <p className="text-gray-600">Total Tickets Sold: {bestSellingEvent.total_tickets_sold}</p>
                </div>
              ) : (
                <p className="text-gray-600">No data</p>
              )}
            </div>
          </div>


          {/* Total Events Hosted */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-semibold mb-2">
                Total Events Hosted
              </h3>
              <p className="text-gray-600">Total Number of Events: {totalEventsHosted}</p>
              <p className="text-gray-600">Total Number of Tickets Sold: {totalTicketsSold}</p>
            </div>
          </div>

          {/* Ticket Sales by Event Type [PIE CHART] */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-semibold mb-2">
                Ticket Sales by Event Type
              </h3>
              <div>
                <canvas ref={chartContainer} width="400" height="400"></canvas>
              </div>
            </div>
          </div>

          {/* Revenue by Ticket Type [TABLE] */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-1">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-semibold mb-2">
                Revenue by Ticket Type
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#FDC27B]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-[#242565] uppercase tracking-wider"
                      >
                        Ticket Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-[#242565] uppercase tracking-wider"
                      >
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {revenueByTicketType.map((data, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {data.ticket_type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${data.total_income}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;
