import "../index.css";
import React, {useContext } from "react";
import SidebarItem from "./SidebarItem";
import { UserContext } from "../contexts/UserContext";

const Sidebar = ({ profileType, onItemClick }) => {
  const { user, logout } = useContext(UserContext);

  const getUserItems = () => [
    { name: "My Profile", to: "/profile" },
    { name: "My Tickets", to: "/tickets" },
    { name: "My Favorites", to: "/favorites" },
    { name: "My Purchases", to: "/purchases" },
    { name: "Log Out", to: "/" },
  ];

  const getOrganizationItems = () => [
    { name: "My Events", to: "/events" },
    { name: "Analytics", to: "/analytics" },
    { name: "Log Out", to: "/" },
  ];
  const mainItems =
    profileType === "user" ? getUserItems() : getOrganizationItems();

  const handleItemClick = async(contentType) => {
    if (onItemClick) {
      onItemClick(contentType);
    }
    if(contentType === "Log Out") {
      handleLogOutClick();
    }
  };

  const handleLogOutClick = async() => {
    await logout();
  };

  return (
    <div className="w-[400px] min-h-screen bg-[#FDC27B] items-center justify-between p-5">
      <div className="mb-4">
        {mainItems.map((item, index) => (
          <SidebarItem key={index} item={item.name} to={item.to} onItemClick={handleItemClick} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
