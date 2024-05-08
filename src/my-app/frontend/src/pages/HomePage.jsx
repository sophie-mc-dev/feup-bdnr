import "../index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import DatePicker from "../components-event-filters/DatePicker";
import CategoryFilter from "../components-event-filters/CategoryFilter";
import LocationFilter from "../components-event-filters/LocationFilter";
import SortByFilter from "../components-event-filters/SortByFilter";
import EventCard from "../components/EventCard";

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategoriesOptions] = useState([]);
  const [locations, setLocationsOptions] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    event_date: "",
    sortBy: "date",
    search: "", // Added search parameter
  });

  useEffect(() => {
    fetchUpcomingEvents();
    fetchCategories();
    fetchLocations();
  }, []);

  const handleFiltersChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchUpcomingEvents();
  };

  const fetchUpcomingEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/events/filter", {
        params: filters,
      });
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

  return (
    <>
      <div className="flex flex-col">
        {/* bg image and search bar container */}
        <div className="half-screen bg-[#FDC27B] flex justify-center items-center">
          <div className="container mx-auto bg-[#242565] rounded-lg p-14">
            <form onSubmit={handleSubmit}>
              <div className="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
                <input
                  className="text-base text-gray-400 flex-grow outline-none px-2"
                  type="text"
                  placeholder="Search event or artist name"
                  value={filters.search}
                  onChange={handleFiltersChange}
                  name="search"
                />
                <div className="ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                  {/* Locations and Date Select */}
                  <LocationFilter
                    name="location"
                    value={filters.location}
                    options={locations}
                    onChange={handleFiltersChange}
                  />
                  <DatePicker
                    name="event_date"
                    onChange={handleFiltersChange}
                  />
                  <button type="submit" className="bg-[#242565] text-white text-base rounded-lg px-4 py-2 font-500">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="ml-20 mr-20 pt-20">
          {/* Container for heading and selects */}
          <div className="flex justify-between items-center mb-10">
            {/* Heading container */}
            <div>
              <h1 className="text-3xl font-bold">Upcoming Events</h1>
            </div>

            {/* Selects container */}
            <div className="flex flex-row gap-x-2">
              <CategoryFilter
                name="category"
                value={filters.category}
                options={categories}
                onChange={handleFiltersChange}
              />
              <SortByFilter
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFiltersChange}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-wrap justify-between gap-5">
              {isLoading ? (
                <div className="flex justify-center items-center w-full">
                  <Loading />
                </div>
              ) : upcomingEvents.length === 0 ? (
                <p>No upcoming events found.</p>
              ) : (
                upcomingEvents.map((upcomingEvent, index) => (
                  <div key={upcomingEvent.event_id} className="flex flex-wrap gap-1 max-w-xs">
                    <EventCard
                      event={upcomingEvent}
                    ></EventCard>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;