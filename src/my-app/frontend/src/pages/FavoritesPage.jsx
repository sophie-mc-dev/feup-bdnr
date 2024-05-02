import "../index.css";
import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import EventCard from "../components/EventCard";
import Sidebar from "../components/Sidebar";

// TODO: use login logic to set the following data
const isLoggedIn = true;
const userInfo = {
  id: "11",
  is_organization: false,
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
      const response = await axios.get(
        "http://localhost:3000/events/favorites/" + userInfo.id
      );
      setFavorites(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const outputFavoritesInfo = (event, index) => {
    return (
      <div
        key={index}
        className="pr-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        
        <EventCard
          title={event.event_name}
          categories={event.categories.join(", ")}
          location={event.location}
          date={event.date}
          likes={event.num_likes}
          price={event.min_price}
          imageUrl=""
        ></EventCard>
      </div>
    );
  };

  // TODO: update cards display and add transactions card

  return (
    <div className="flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h2 className="text-2xl font-semibold mb-6">My Favorites</h2>
        <div className="flex flex-col gap-y-5">
          {isLoading ? (
            <Loading />
          ) : favorites.length === 0 ? (
            <p>No events found.</p>
          ) : (
            favorites.map((favorite, index) =>
              outputFavoritesInfo(favorite, index)
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
