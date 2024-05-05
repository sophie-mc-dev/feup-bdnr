import "../index.css";
import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import Loading from "../components/Loading";

const ProfilePage = () => {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({name: "", username: "", email: "", password: ""});
  const [isLoading, setIsLoading] = useState(true);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newFormData = formData;
    newFormData[name] = value;
    setFormData(newFormData);
  };

  const handleSave = () => { //TODO: [backend] send changes to the backend
    console.log("Saving changes...");   
  };

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
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Save Button */}
            <button
              onClick={handleSave}
              className="bg-[#242565] hover:bg-[#494391] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
