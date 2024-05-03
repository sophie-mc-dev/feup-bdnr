import React, { useState, useEffect } from "react";
import axios from "axios";
import ArtistCard from "../components/ArtistCard";
import Loading from "../components/Loading";

const AllArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("");

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/artists");
      setArtists(response.data);
      setFilteredArtists(response.data); // Initialize filteredArtists with all artists
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching artists:", error);
    }
  };

  const filterArtistsByLetter = (letter) => {
    setSelectedLetter(letter);
    if (letter === "All") {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter((artist) => artist.artist_name.charAt(0).toUpperCase() === letter);
      setFilteredArtists(filtered);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Artists</h1>
      <div className="flex justify-center mb-4">
        <button className={`mr-2 ${selectedLetter === "All" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"} px-3 py-1 rounded-lg`} onClick={() => filterArtistsByLetter("All")}>
          All
        </button>
        {Array.from(Array(26)).map((_, index) => (
          <button key={index} className={`mr-2 ${selectedLetter === String.fromCharCode(65 + index) ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"} px-3 py-1 rounded-lg`} onClick={() => filterArtistsByLetter(String.fromCharCode(65 + index))}>
            {String.fromCharCode(65 + index)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <Loading />
        ) : (
          filteredArtists.map((artist, index) => (
            <div key={index} className="mb-4">
              <ArtistCard artist={artist} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllArtistsPage;
