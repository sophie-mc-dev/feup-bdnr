import "../index.css";
import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import Sidebar from "../components/Sidebar";

// Placeholder data
const placeholderComments = [
  {
    comment_id: "1",
    user_id: "1367",
    user_name: "Gary Ayala",
    event_id: "2427",
    text: "Personal arm space public shake culture will. To dream research move hospital try join. Ready almost reach speak shoulder land loss. Truth prepare focus improve whose also fact.",
  },
];

// TODO: use login logic to set the following data
const isLoggedIn = true;
const userInfo = {
  id: "11",
  is_organization: false,
};

const CommentsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching comments
    setTimeout(() => {
      setComments(placeholderComments);
      setIsLoading(false);
    }, 1000); // Simulate 1 second delay
  }, []);

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h2 className="text-2xl font-semibold mb-6">My Comments</h2>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {comments.length === 0 ? (
              <p>No comments found.</p>
            ) : (
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li key={comment.comment_id}>
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {comment.user_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {comment.text}
                        </div>
                        <div className="text-xs text-gray-400">
                          {comment.createdAt}
                        </div>
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
