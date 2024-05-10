import "../index.css";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user.is_organization) {
      navigate("/");
    } else {
      fetchFavorites();
    }
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
      <div key={index} className="flex flex-wrap gap-5 mb-6 max-w-xs">
        <EventCard event={event}></EventCard>
      </div>
    );
  };

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h3 className="text-2xl font-bold mb-6">My Favorites</h3>
        <div className="flex flex-wrap gap-5 mb-6">
          {isLoading ? (
            <div className="flex justify-center items-center w-full">
              <Loading />
            </div>
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
