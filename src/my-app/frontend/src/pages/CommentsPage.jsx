import "../index.css";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";

const CommentsPage = () => {
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/comments/users/" + user.user_id
      );
      setComments(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteButtonClick = (comment) => {
    setCommentToDelete(comment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setCommentToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleteModalOpen(false);
      await axios.delete("http://localhost:3000/comments/" + commentToDelete.comment_id);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h3 className="text-2xl font-bold mb-6">My Comments</h3>
        {isLoading ? (
          <div className="flex-1 h-full flex items-center justify-center">
            <Loading />
          </div>
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
                          Event name: {comment.event_name}
                        </div>
                      </div>
                      {user && (
                        <button
                          className="top-2 right-2 bg-red-500 text-white rounded px-2 py-1"
                          onClick={() => handleDeleteButtonClick(comment)}
                        >
                        Delete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="mb-4">
              Are you sure you want to delete your comment?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
