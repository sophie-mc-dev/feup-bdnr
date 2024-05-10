import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import LikeStateLoading from "../components/LikeStateLoading";
import axios from "axios";
import FormatDate from "../utils/FormattedDate"

const EventCard = ({ event }) => {
  const { user, isLoggedIn, updateLikedEvents } = useContext(UserContext);
  const [likeStateLoading, setLikeStateLoading] = useState(false);
  const [liked, setLiked] = useState(isLoggedIn && user.liked_events.includes(event.event_id));
  const [numLikes, setNumLikes] = useState(event.num_likes);

  const handleLikeClick = async () => {
    let response;
    setLikeStateLoading(true);
    if (liked) {
      response = await axios.delete(
        "http://localhost:3000/users/dislike", {
          data: {
            user_id: user.user_id,
            event_id: event.event_id
          }
        }
      );
    } else {
      response = await axios.put(
        "http://localhost:3000/users/like",{
          user_id: user.user_id,
          event_id: event.event_id
        }
      );
    }

    await updateLikedEvents(response.data);
    setLiked(!liked);
    setNumLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLikeStateLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[230px] w-[350px] transition-transform duration-300 ease-in-out hover:scale-105">
      {/* Details container */}
      <div className="flex-grow p-4">
        {/* Title and Like Button */}
        <div className="flex justify-between items-center">
          <a
            href={`/events/${event.event_id}`}
            className="text-md font-bold mb-1"
          >
            {event.event_name}
          </a>
          {/* Heart button */}
          {user && !user.is_organization && !likeStateLoading && (
            <button
              onClick={handleLikeClick}
              className={`text-gray-500 focus:outline-none ${
                liked ? "text-red-500" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </button>
          )}

          {user && !user.is_organization && likeStateLoading && (
            <LikeStateLoading/>
          )}
        </div>

        {/* Location and Date */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {event.location}
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-gray-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <line x1="16" y1="3" x2="16" y2="7" />
            <line x1="8" y1="3" x2="8" y2="7" />
            <line x1="4" y1="11" x2="20" y2="11" />
            <line x1="11" y1="15" x2="12" y2="15" />
            <line x1="12" y1="15" x2="12" y2="18" />
          </svg>
          {FormatDate(event.date)}
        </div>

        {/* Likes and Price */}
        <div className="flex justify-between items-center">
          {/* Likes */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-gray-500 mr-1"
            >
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>

            <span className="text-xs text-gray-500">
              {numLikes} {numLikes === 1 ? "person" : "people"}{" "}
              {numLikes === 1 ? "likes" : "like"} this
            </span>
          </div>
          {/* Price */}
          <div className="text-xs text-gray-500">
            Starting at ${event.min_price}
          </div>
        </div>

        {/* Categories */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-wrap">
            {event.categories.map((category, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-600 mr-2 mb-2"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
