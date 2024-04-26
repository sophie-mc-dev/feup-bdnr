// Sidebar.js
import React from "react";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ profileType, onItemClick }) => {
  const getUserItems = () => [
    "My Profile",
    "My Tickets",
    "My Favorites",
    "My Purchases",
  ];

  const getOrganizationItems = () => ["My Events", "Analytics"];

  const mainItems = profileType === "user" ? getUserItems() : getOrganizationItems();
  const additionalItems = ["Settings", "Log Out"];

  const handleItemClick = (contentType) => {
    if (onItemClick) {
      onItemClick(contentType); // Notify parent component (ProfileLayout)
    }
  };

  return (
    <div className="w-[400px] h-full min-h-screen bg-[#FDC27B] items-center justify-between p-5">
      <div className="mb-4">
        {mainItems.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            onItemClick={handleItemClick}
          />
        ))}
      </div>

      <div>
        {additionalItems.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            onItemClick={handleItemClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
