import "../index.css";
import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import axios from "axios";

// TODO: use login logic to set the following data
const isLoggedIn = true;
const userInfo = {
  id: "11",
  is_organization: false
};

const FavoritesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/events/favorites/" + userInfo.id);
      setFavorites(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const outputFavoritesInfo = (event, index) => {
    return(
      <div key={index} className="flex flex-col rounded-lg gap-y-5 px-7 py-5 bg-gray-200">
        <p>Name: {event.event_name}</p>
        <p>Date: {event.date}</p>
        <p>Location: {event.location}</p>
        <p>Categories: {event.categories}</p>
        <p>Num. likes: {event.num_likes}</p>
        <p>From €{event.min_price}</p>
      </div>
    );
  }

  return (
    <div>
        <h2 className="text-2xl font-semibold mb-6">My Favorites</h2>
        <div className="flex flex-col gap-y-5">
          {isLoading ? (
            <Loading />
          ) : favorites.length === 0 ? (
            <p>No events found.</p>
          ) : ( 
            favorites.map((favorite, index) => (
              outputFavoritesInfo(favorite, index)
            ))
          )}
        </div>
          
        </div>
  );
};

export default FavoritesPage;
