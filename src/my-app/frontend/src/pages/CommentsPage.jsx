import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";

const CommentsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    if (user.is_organization) {
      navigate("/");
    } else {
      fetchComments();
    }
  }, [sortOrder]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/comments/users/" + user.user_id
      );
      let fetchedComments = response.data;

      if (sortOrder === "oldest") {
        fetchedComments = fetchedComments.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      } else if (sortOrder === "newest") {
        fetchedComments = fetchedComments.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      }

      setComments(fetchedComments);
      setIsLoading(false);
      console.log(fetchedComments);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // TODO: handle the delete here too

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h3 className="text-2xl font-bold mb-6">My Comments</h3>
        <div className="mb-4 flex justify-end">
          <select
            className="select select-bordered max-w-xs text-base bg-gray-200 text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <div>
            {comments.length === 0 ? (
              <p>No comments found.</p>
            ) : (
              <ul className="space-y-8">
                {comments.map((comment) => (
                  <li key={comment.comment_id}>
                    <p className="text-gray-500 text-sm mb-2">
                      COMMENT DATE HERE : {comment.date}
                    </p>
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-s">
                      <a
                        href={`/events/${comment.event_id}`}
                        className="text-l font-semibold mb-2"
                      >
                        EVENT NAME HERE : {comment.event_name}
                      </a>
                      <div className="text-gray-700 mb-2">
                        <p className="text-sm font-medium">
                          {comment.user_name}
                        </p>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
