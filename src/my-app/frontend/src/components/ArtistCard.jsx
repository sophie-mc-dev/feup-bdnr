import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import axios from "axios";

const ArtistCard = ({ artist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [events, setEvents] = useState([]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded) {
      fetchEvents();
    }
  }, [isExpanded]);

  const fetchEvents = async () => {
    try {
      const response = await Promise.all(artist.event_ids.map(eventId => axios.get(`http://localhost:3000/events/${eventId}`)));
      setEvents(response.map(res => res.data));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleExpand}
      >
        <h2 className="text-lg font-semibold">{artist.artist_name}</h2>
        <svg
          className={`w-6 h-6 transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </div>
      {isExpanded && (
        <div className="mt-4 p-4">
          <p className="text-sm text-gray-600">{artist.artist_biography}</p>
          <h3 className="text-md font-semibold mt-2">Top 5 Music:</h3>
          <ul className="list-disc list-inside">
            {artist.artist_top5_music.map((music, index) => (
              <li key={index}>{music}</li>
            ))}
          </ul>
          <h3 className="text-md font-semibold mt-4">Events:</h3>
          <div className="flex flex-wrap gap-4 mt-2">
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistCard;
