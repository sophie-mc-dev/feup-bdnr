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

  useEffect(() => {
    if (!user.is_organization) {
      navigate("/");
    } else {
      // fetch
    }
  }, []);

  // SAMPLE DATA FOR REVENUE DATA OF TICKET TYPES
  const revenueData = [
    { ticketType: "VIP", revenue: 1500 },
    { ticketType: "General Admission", revenue: 2500 },
    { ticketType: "Early Bird", revenue: 1000 },
  ];

  // PIE CHART WITH SAMPLE DATA
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Concerts", "Sports Events", "Conferences"],
          datasets: [
            {
              label: "Ticket Sales",
              data: [300, 200, 150],
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

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
              <p className="text-gray-600">Display total income here</p>
            </div>
          </div>

          {/* Best Selling Event */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-1">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-semibold mb-2">Best Selling Event</h3>
              <p className="text-gray-600">
                Display best selling event here with event card
              </p>
            </div>
          </div>

          {/* Total Events Hosted */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-semibold mb-2">
                Total Events Hosted
              </h3>
              <p className="text-gray-600">Total Number of Events:</p>
              <p className="text-gray-600">
                (get events by organization ID and display event cards here)
              </p>
            </div>
          </div>

          {/* Ticket Sales by Event Type [PIE CHART] */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-semibold mb-2">
                Ticket Sales by Event Type
              </h3>
              <p className="text-gray-600">
                Display ticket sales by event type here (show total number of
                tickets)
              </p>
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
                    {revenueData.map((data, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {data.ticketType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${data.revenue}
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
