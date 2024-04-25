import "../index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "../components/TopBar";
import Loading from "../components/Loading";
import Footer from "../components/Footer";

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategoriesOptions] = useState([]);
  const [locations, setLocationsOptions] = useState([]);
  const [artists, setArtistsOptions] = useState([]);

  const initialFilters = {
    category: "",
    location: "",
    artist: "",
    event_date: "",
    sortBy: "date",
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    fetchUpcomingEvents();
    fetchCategories();
    fetchLocations();
    fetchArtists();
  }, []);

  const handleFiltersChange = (event) => {
    const { name, value } = event.target;
    let newFilters = filters;
    newFilters[name] = value;
    setFilters(newFilters);

    fetchUpcomingEvents();
  };

  const fetchUpcomingEvents = async () => {
    setIsLoading(true);
    try {
      let response;
      const hasFilters =
        Object.values(filters).some((value) => value.trim().length > 0) &&
        filters !== initialFilters;

      if (hasFilters) {
        response = await axios.get("http://localhost:3000/events/filter", {
          params: filters,
        });
      } else {
        response = await axios.get("http://localhost:3000/events");
      }
      setUpcomingEvents(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategoriesOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://localhost:3000/locations");
      setLocationsOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:3000/artists/names");
      setArtistsOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <TopBar></TopBar>

        {/* bg image and search bar container */}
        <div className='half-screen bg-gray-100 flex justify-center items-center'>
          <div className="container mx-auto bg-[#242565] rounded-lg p-14">
            <form>
              <div className="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
                <input
                  className="text-base text-gray-400 flex-grow outline-none px-2 "
                  type="text"
                  placeholder="Search event or artist name"
                />
                <div className="ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                  {/* Locations Select */}
                  <select
                    className="text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                    name="location"
                    value={filters.location}
                    onChange={handleFiltersChange}
                  >
                    <option value="">All Locations</option>
                    {locations.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* Date Picker */}
                  <input
                    className="text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                    name="event_date"
                    type = "date"
                    onChange={handleFiltersChange}
                  >
                  </input>
                  <button className="bg-[#242565] text-white text-base rounded-lg px-4 py-2 font-500">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="ml-20 mr-20 pt-20">
          {/* Container for heading and selects */}
          <div className="flex justify-between items-center mb-4">
            {/* Heading container */}
            <div>
              <h1 className="text-3xl font-bold">Upcoming Events</h1>
            </div>

            {/* Selects container */}
            <div className="flex flex-row gap-x-2">
              {/* First Select (Category) */}
              <select
                className="select select-bordered max-w-xs text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                name="category"
                value={filters.category}
                onChange={handleFiltersChange}
              >
                <option value="">All Categories</option>
                {categories.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Second Select (Artists) */}
              <select
                className="select select-bordered max-w-xs text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                name="artist"
                value={filters.artist}
                onChange={handleFiltersChange}
              >
                <option value="">All Artists</option>
                {artists.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Third Select (Sort By) */}
              <select
                className="select select-bordered max-w-xs text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFiltersChange}
              >
                <option value="date">Date (ascending)</option>
                <option value="price_asc">Price (ascending)</option>
                <option value="price_desc">Price (descending)</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>

          {/* Container for events */}
          <div className="flex flex-col gap-y-5">
            {isLoading ? (
              <Loading />
            ) : upcomingEvents.length === 0 ? (
              <p>No upcoming events found.</p>
            ) : (
              upcomingEvents.map((upcomingEvent, index) => (
                <div
                  key={upcomingEvent.event_id}
                  className="p-5 border bg-gray-100 rounded-lg"
                >
                  <p>{upcomingEvent.event_name}</p>
                  <p>Location: {upcomingEvent.location}</p>
                  <p>Categories: {upcomingEvent.categories.join(", ")}</p>
                  <p>Date and Time: {upcomingEvent.date}</p>
                  <p>Num likes: {upcomingEvent.num_likes}</p>
                  <p>Min price: {upcomingEvent.min_price}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;
