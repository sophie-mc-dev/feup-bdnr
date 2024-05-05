import "../index.css";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import EventCard from "../components/EventCard";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";

const FavoritesPage = () => {
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/events/favorites/" + user.user_id
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
      <div className="flex-1 flex">
        <div
          key={index}
          className="pr-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <EventCard event={event}></EventCard>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h3 className="text-2xl font-bold mb-6">My Favorites</h3>
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
