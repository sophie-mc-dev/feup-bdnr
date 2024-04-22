import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';

function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategoriesOptions] = useState([]);
  const [locations, setLocationsOptions] = useState([]);
  const [artists, setArtistsOptions] = useState([]);
  const [filters, setFilters] = useState({ category: '', location: '', artist: '' });

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
      const hasFilters = Object.values(filters).some(value => value.trim().length > 0);

      if (hasFilters) {
        response = await axios.get('http://localhost:3000/events/filter', {params: filters});
      } else {
        response = await axios.get('http://localhost:3000/events');
      }
      setUpcomingEvents(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategoriesOptions(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/locations');
      setLocationsOptions(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await axios.get('http://localhost:3000/artists/names');
      setArtistsOptions(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div className='flex flex-col gap-y-10'>
        <TopBar></TopBar>

        <div className='ml-20 mr-20 flex flex-col gap-y-8'>
          <h1 className="text-3xl font-bold underline ">Upcoming Events</h1>

          <select name="category" value={filters.category} onChange={handleFiltersChange}> 
            <option value="">All Categories</option>
            {categories.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select name="location" value={filters.location} onChange={handleFiltersChange}> 
            <option value="">All Locations</option>
            {locations.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select name="artist" value={filters.artist} onChange={handleFiltersChange}> 
            <option value="">All Artists</option>
            {artists.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="flex flex-col gap-y-5">
            {upcomingEvents.map((upcomingEvent, index) => (
              <div className='p-5 border bg-gray-100 rounded-lg'>
                <p>{upcomingEvent.event_name}</p>
                <p>Location: {upcomingEvent.location}</p>
                <p>Categories: {upcomingEvent.categories.join(', ')}</p>
                <p>Date and Time: {upcomingEvent.date}</p>
                {upcomingEvent.artists && <p>Artists: {upcomingEvent.artists.join(', ')}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>  
    </>
  );
}

export default HomePage;
