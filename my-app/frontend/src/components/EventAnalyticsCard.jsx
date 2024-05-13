import React from "react";

const EventAnalyticsCard = ({totalEventRevenue, revenueByTicketType, totalTicketsSold, ticketsSoldByTicketType}) => {


  return (
    <div className="bg-[#FDC27B] rounded-lg overflow-hidden shadow-md">
      <div className="p-6 flex flex-row gap-6">
        {/* Total Event Revenue */}
        <div className="w-full md:w-1/2">
          <div className="bg-white p-4 rounded-md flex flex-col h-full justify-between">
            <p className="mb-2 text-lg font-semibold">Total Event Revenue</p>
            <div className="flex justify-center items-center flex-grow">
              <p className="text-4xl font-bold">
                ${totalEventRevenue}
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
                {revenueByTicketType.map((data, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{data.ticket_type}</span>
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
                {totalTicketsSold}
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
                {ticketsSoldByTicketType.map((data, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{data.ticket_type}</span>
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
