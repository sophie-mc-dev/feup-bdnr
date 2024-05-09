import "../index.css";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import Loading from "../components/Loading";

const ProfilePage = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({name: "", username: "", email: "", password: ""});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async()  => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/users/" + user.user_id
      );
      setFormData({ name: response.data.name, username: response.data.username, email: response.data.email, password: "" });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrorMessage("");
  };

  const handleSave = async () => { 
    if (!formData.name || !formData.username || !formData.email) {
      setErrorMessage("Name, username and email fields cannot be empty");
      return;
    } 

    console.log("Saving changes...");   
    setIsLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:3000/users/" , {
          user_id: user.user_id,
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password
        }
      );
      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
        console.log(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };


  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  }

  const handleDeleteConfirm = async () => {  
    setIsDeleteModalOpen(false);
    setIsLoading(true);

    try {
      await axios.delete(
        "http://localhost:3000/users/", {
          data: {
            user_id: user.user_id
          }
        }
      );
      console.log("Account deleted successfully.");
      
      await logout().then(() => {
        navigate("/");
      });

    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting user:", error);
    }
  }
  
  return (
    <div className="flex-1 flex">
      <Sidebar profileType={user.is_organization ? "organization" : "user"} />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        {isLoading ? (
          <div className="flex-1 h-full flex items-center justify-center">
            <Loading/>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-6">My Profile</h3>
            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Username */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Error Message */}
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            {/* Save and Delete Buttons */}
            <div className="flex flex-row gap-x-2">
              <button onClick={handleSave} className="bg-[#242565] hover:bg-[#494391] text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Save Changes
              </button>

              {!user.is_organization && 
                <button onClick={handleDeleteClick} className="bg-red-500 hover:bg-red-400 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Delete Account
                </button>
              }
            </div>
            
            {/* Delete Modal */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
