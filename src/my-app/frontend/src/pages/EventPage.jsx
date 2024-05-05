import "../index.css";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import TicketTypeCard from "../components/TicketTypeCard";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${month} ${day}, ${year} at ${hours}h${minutes}`;
};

const EventPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventInfo(id);
      fetchCommentsInfo(id);
    }
  }, [id]);

  const fetchEventInfo = async (id) => {
    try {
      const response = await axios.get("http://localhost:3000/events/" + id);
      setEventInfo(response.data);
      setIsInfoLoading(false);
    } catch (error) {
      setIsInfoLoading(false);
    }
  };

  const fetchCommentsInfo = async (id) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/comments/events/" + id
      );
      setComments(response.data);
      setIsCommentsLoading(false);
      console.log(response.data);
    } catch (error) {
      setIsCommentsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
        return <Navigate to="/login" />;
    }
    try {
        setIsSubmittingComment(true);
        const response = await axios.post("http://localhost:3000/comments", {
            event_id: id,
            user_id: user.id,
            user_name: user.username,
            text: commentText
        });
        console.log("Comment submitted:", response.data.comment);
        setCommentText("");
        await fetchCommentsInfo(id);
    } catch (error) {
        console.error("Error submitting comment:", error);
    } finally {
        setIsSubmittingComment(false);
    }
};

  return (
    <div className="flex flex-col items-center">
      {isInfoLoading ? (
        <Loading />
      ) : (
        <div className=" w-full p-20">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-5">
              <h2 className="text-2xl font-semibold mb-6">
                {eventInfo.event_name}
              </h2>

              <div className="">
                {eventInfo.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-600 mr-2 mb-2"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="red"
                className="w-6 h-6"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>

              <p className="mb-4">{eventInfo.num_likes} likes</p>
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="mb-4">
              {eventInfo.location} | {eventInfo.address}
            </p>
          </div>

          <div className="flex flex-row gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="mb-4">{formatDate(eventInfo.date)}</p>
          </div>

          <p className="mb-4">{eventInfo.description}</p>

          <h3 className="mt-5 mb-3 text-lg font-semibold">Ticket Types:</h3>
          <div className="grid gap-4">
            {eventInfo.ticket_types.map((ticket, index) => (
              <TicketTypeCard key={index} ticket={ticket} />
            ))}
          </div>

          {user && (
            <div className="mt-8">
              <textarea
                className="w-full h-24 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Write your comment here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <button
                className="bg-[#494391] text-white font-semibold text-base rounded-lg px-4 py-2 font-500 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 mt-2"
                onClick={handleCommentSubmit}
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? "Submitting..." : "Post Comment"}
              </button>
            </div>
          )}

          <h3 className="mt-5 mb-3 text-lg font-semibold">Comments:</h3>
          {isCommentsLoading ? (
            <Loading />
          ) : (
            <div>
              {comments.map((comment) => (
                <div key={comment.comment_id} className="p-4">
                  <p>User name: {comment.user_name}</p>
                  <p>Text: {comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default EventPage;
