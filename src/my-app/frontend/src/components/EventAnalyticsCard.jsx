import React from "react";

const EventAnalyticsCard = () => {
  // Sample analytics data (replace with actual data)
  const analyticsData = {
    totalEventRevenue: 5000,
    revenueByTicketType: [
      { ticketType: "VIP", revenue: 1500 },
      { ticketType: "General Admission", revenue: 2500 },
      { ticketType: "Early Bird", revenue: 1000 },
    ],
    totalTicketsSold: 300,
    ticketsSoldByTicketType: [
      { ticketType: "VIP", quantity: 100 },
      { ticketType: "General Admission", quantity: 150 },
      { ticketType: "Early Bird", quantity: 50 },
    ],
  };

  return (
    <div className="bg-[#FDC27B] rounded-lg overflow-hidden shadow-md">
      <div className="p-6 flex flex-row gap-6">
        {/* Total Event Revenue */}
        <div className="w-full md:w-1/2">
          <div className="bg-white p-4 rounded-md flex flex-col h-full justify-between">
            <p className="mb-2 text-lg font-semibold">Total Event Revenue</p>
            <div className="flex justify-center items-center flex-grow">
              <p className="text-4xl font-bold">
                ${analyticsData.totalEventRevenue}
              </p>
            </div>
          </div>
        </div>

        {/* Revenue by Ticket Type */}
        <div className="w-full md:w-1/2">
          <div className="bg-white p-4 rounded-md flex flex-col h-full justify-between">
            <div>
              <p className="mb-2 text-lg font-semibold">
                Revenue by Ticket Type
              </p>
              <ul>
                {analyticsData.revenueByTicketType.map((data, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{data.ticketType}</span>
                    <span className="font-semibold">${data.revenue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Total Number of Tickets Sold */}
        <div className="w-full md:w-1/2">
          <div className="bg-white p-4 rounded-md flex flex-col justify-center h-full">
            <p className="mb-2 text-lg font-semibold text-left">
              Total Number of Tickets Sold
            </p>
            <div className="flex justify-center items-center flex-grow">
              <p className="text-4xl font-bold">
                {analyticsData.totalTicketsSold}
              </p>
            </div>
          </div>
        </div>

        {/* Number of Tickets Sold by Ticket Type */}
        <div className="w-full md:w-1/2">
          <div className="bg-white p-4 rounded-md flex flex-col h-full justify-between">
            <div>
              <p className="mb-2 text-lg font-semibold">
                Number of Tickets Sold by Ticket Type
              </p>
              <ul>
                {analyticsData.ticketsSoldByTicketType.map((data, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{data.ticketType}</span>
                    <span className="font-semibold">{data.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalyticsCard;
