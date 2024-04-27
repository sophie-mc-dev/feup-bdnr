import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";

const ArtistPage = ({ artist }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [artistInfo, setArtistInfo] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);

  // Placeholder data
  const placeholderArtist = {
    artist_name: "AC/DC",
    artist_biography:
      "Yeah admit bit her involve college.\nAnalysis raise then forget mission moment. One seat call design cell street. Military scene season popular worker.",
    artist_top5_music: [
      "Back in Black",
      "Highway to Hell",
      "Thunderstruck",
      "You Shook Me All Night Long",
      "T.N.T.",
    ],
    event_ids: [1045, 1537],
  };

  // Use placeholder data if no artist data provided
  artist = artist || placeholderArtist;

  return (
    <div className="flex flex-col">
      <TopBar></TopBar>
      <div className="p-20">
        <h2 className="text-2xl font-semibold mb-6">AN {artistInfo}</h2>{" "}
        {/* name */}
        <p className="mb-4">AB {artistInfo}</p> {/* biography */}
        <h2 className="text-xl font-bold mb-2">Top 5 Music:</h2>{" "}
        {/* top 5 songs */}
        <ul className="list-disc pl-6 mb-4">
          {/* {artistInfo.map((song, index) => (
            <li key={index}>{song}</li>
          ))} */}
        </ul>
        <h2 className="text-xl font-bold mb-2">Events this artist is in:</h2>
        <div className="grid grid-cols-1 gap-4">
          {/* {artist.event_ids.map((eventId) => (
            <EventCard
              key={eventId}
              title={eventInfo}
              categories={eventInfo}
              location={eventInfo}
              date={eventInfo}
              likes={eventInfo}
              price={eventInfo}
              imageUrl={eventInfo}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
