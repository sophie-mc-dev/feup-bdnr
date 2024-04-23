import React, { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";

function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategoriesOptions] = useState([]);
  const [locations, setLocationsOptions] = useState([]);
  const [artists, setArtistsOptions] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    artist: "",
    sortBy: "date",
  });

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
    try {
      let response;
      const hasFilters =
        Object.values(filters).some((value) => value.trim().length > 0) &&
        filters.sortBy !== "date";

      if (hasFilters) {
        response = await axios.get("http://localhost:3000/events/filter", {
          params: filters,
        });
      } else {
        response = await axios.get("http://localhost:3000/events");
      }
      setUpcomingEvents(response.data);
    } catch (error) {
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
        <div class="min-h-screen bg-gray-100 flex justify-center items-center">
          <div class="container mx-auto bg-[#242565] rounded-lg p-14">
            <form>
              <div class="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
                <input
                  class="text-base text-gray-400 flex-grow outline-none px-2 "
                  type="text"
                  placeholder="Search event or artist name"
                />
                <div class="ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                  {/* Locations Select */}
                  <select
                    class="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
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

                  {/* Date Select */}
                  <select
                    class="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                    name="date"
                    value={filters.sortBy}
                    onChange={handleFiltersChange}
                  >
                    <option value="" selected>
                      Any date
                    </option>
                    {/* date picker?? */}
                  </select>
                  <button class="bg-[#242565] text-white text-base rounded-lg px-4 py-2 font-500">
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
            <div className="flex items-center">
              {/* First Select (Category) */}
              <select
                className="select select-bordered w-full max-w-xs"
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

              {/* Second Select (Sort By) */}
              <select
                className="select select-bordered w-full max-w-xs ml-2"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFiltersChange}
              >
                <option value="price_asc">Price (ascending)</option>
                <option value="price_desc">Price (descending)</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>

          {/* Container for events */}
          <div className="flex flex-col gap-y-5">
            {upcomingEvents.map((upcomingEvent, index) => (
              <div key={index} className="p-5 border bg-gray-100 rounded-lg">
                <p>{upcomingEvent.event_name}</p>
                <p>Location: {upcomingEvent.location}</p>
                <p>Categories: {upcomingEvent.categories.join(", ")}</p>
                <p>Date and Time: {upcomingEvent.date}</p>
                <p>Num likes: {upcomingEvent.num_likes}</p>
                <p>Min price: {upcomingEvent.min_price}</p>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;
