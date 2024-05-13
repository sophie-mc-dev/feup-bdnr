import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";
import FormatDate from "../utils/FormattedDate"

const CommentsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCommentText, setEditCommentText] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
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
      const response = await axios.delete("http://localhost:3000/comments", {
        params: {
            comment_id: commentToDelete.comment_id,
            user_id: user.user_id,
        }
      });
      console.log(response.data)
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditButtonClick = (comment) => {
    setSelectedCommentId(comment.comment_id);
    setEditCommentText(comment.text);
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setSelectedCommentId(null);
  };

  const handleEditConfirm = async (newText) => {
    try {
      setIsEditModalOpen(false);
      const response = await axios.put("http://localhost:3000/comments", {
        comment_id: selectedCommentId,
        user_id: user.user_id,
        text: newText,
      });
      console.log(response.data)
      setSelectedCommentId(null);
      fetchComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <div className="flex flex-wrap justify-between align-baseline">
          <h3 className="text-2xl font-bold mb-6">My Comments</h3>
          <div className="mb-4 flex justify-end flex-grow">
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
                      {FormatDate(comment.date)}
                    </p>
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-s flex items-start justify-between">
                      <div>
                        <a
                          href={`/events/${comment.event_id}`}
                          className="text-l font-semibold mb-2"
                        >
                          {comment.event_name}
                        </a>
                        <div className="text-gray-700 mb-2">
                          <p className="text-sm font-medium">
                            {comment.user_name}
                          </p>
                          <div className="text-sm text-gray-500">
                            {comment.text}
                          </div>
                        </div>
                      </div>
                      {user && (
                        <div className="flex">
                          <button
                            className="bg-[#494391] text-white px-2 py-1 rounded"
                            onClick={() => handleEditButtonClick(comment)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                            onClick={() => handleDeleteButtonClick(comment)}
                          >
                            Delete
                          </button>
                        </div>
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
            <p className="mb-6">
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

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
           <div className="bg-white p-6 w-1/3 h-auto rounded-md shadow-md">
            <p className="mb-4 font-medium">Edit your comment:</p>
            <textarea
              className="w-full h-24 px-3 text-neutral-600 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={editCommentText}
              onChange={(e) => setEditCommentText(e.target.value)}
            ></textarea>
            <div className="flex mt-2 justify-end">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
                onClick={handleEditCancel}
              >
                Cancel
              </button>
              <button
                className="bg-[#494391] text-white px-4 py-2 rounded-md"
                onClick={() => handleEditConfirm(editCommentText)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
