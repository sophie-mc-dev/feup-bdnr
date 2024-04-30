import React from "react";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ profileType, onItemClick }) => {
  const getUserItems = () => [
    "My Profile",
    "My Tickets",
    "My Favorites",
    "My Purchases",
    "Log Out",
  ];

  const getOrganizationItems = () => ["My Events", "Analytics", "Log Out"];

  const mainItems =
    profileType === "user" ? getUserItems() : getOrganizationItems();

  const handleItemClick = (contentType) => {
    if (onItemClick) {
      onItemClick(contentType); 
    }
  };

  return (
    <div className="w-[400px] h-full min-h-screen bg-[#FDC27B] items-center justify-between p-5">
      <div className="mb-4">
        {mainItems.map((item, index) => (
          <SidebarItem key={index} item={item} onItemClick={handleItemClick} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
