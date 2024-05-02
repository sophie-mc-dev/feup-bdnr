import React, { useState } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure minutes are always two digits

  return `${month} ${day} ${year}, ${hours}h${minutes}`;
};

const EventCard = ({
  title,
  categories,
  location,
  date,
  likes,
  price,
  imageUrl,
}) => {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  // TODO: handle event card click (on title only?)
  // allow filter by category when the category is clicked
  // update card fixed width and height so they all look the same

  const categoryList = categories.split(", ");
  const formattedDate = formatDate(date);

  const imageContainerStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundColor: imageUrl ? "transparent" : "#D1D5DB",
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-120 max-w-s">
      {/* Image container */}
      <div
        className="w-full h-40 bg-cover bg-center"
        style={imageContainerStyle}
        aria-label={title}
      >
        {/* Display placeholder content if imageUrl is not provided */}
        {!imageUrl && (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Image Not Available</span>
          </div>
        )}
      </div>

      {/* Details container */}
      <div className="flex-grow p-4">
        {/* Categories and Heart button */}
        <div className="flex justify-between items-center mb-2">
          {/* Categories */}
          <div className="flex flex-wrap">
            {categoryList.map((category, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-600 mr-2 mb-2"
              >
                {category}
              </span>
            ))}
          </div>
          {/* Heart button */}
          <button
            onClick={handleLikeClick}
            className={`text-gray-500 focus:outline-none ${
              liked ? "text-red-500" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 fill-current"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18l-1.48-1.333C4.598 12.339 1 9.164 1 5.5 1 3.567 2.578 2 4.5 2 5.797 2 7.069 2.803 8 4 8.931 2.803 10.203 2 11.5 2 13.422 2 15 3.567 15 5.5c0 3.664-3.598 6.839-7.52 11.167L10 18z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Title, Location, Date */}
        <div className="text-lg font-bold mb-1">{title}</div>
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
          {location}
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
          {formattedDate}
        </div>

        {/* Likes and Price */}
        <div className="flex justify-between items-center">
          {/* Likes */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18l-1.48-1.333C4.598 12.339 1 9.164 1 5.5 1 3.567 2.578 2 4.5 2 5.797 2 7.069 2.803 8 4 8.931 2.803 10.203 2 11.5 2 13.422 2 15 3.567 15 5.5c0 3.664-3.598 6.839-7.52 11.167L10 18z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-gray-500">
              {likes} {likes === 1 ? "person" : "people"}{" "}
              {likes === 1 ? "likes" : "like"} this
            </span>
          </div>
          {/* Price */}
          <div className="text-xs text-gray-500">Starting at ${price}</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
