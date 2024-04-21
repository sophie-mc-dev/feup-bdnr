import React from "react";

const Sidebar = ({ profileType, onItemClick }) => {
  const getUserItems = () => [
    "My Profile",
    "My Tickets",
    "My Liked Events",
    "My Orders",
  ];
  const getOrganizationItems = () => [
    "My Settings",
    "My Events",
    "Analytics",
  ];

  const mainItems =
    profileType === "user" ? getUserItems() : getOrganizationItems();
  const additionalItems = ["Settings", "Log Out"];

  return (
    <div className="w-[400px] h-full min-h-screen bg-[#FDC27B] items-center justify-between p-5">
      <div className="sidebar-section">
        {mainItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-[#242565] text-[white] cursor-pointer mb-2.5 p-2.5 hover:bg-[#494391]"
            onClick={() => onItemClick(item)}
          >
            <span className="grow font-medium">{item}</span>
            <span className="text-base ml-[5px]">➔</span>
          </div>
        ))}
      </div>
      <div className="sidebar-section">
        {additionalItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-[#242565] text-[white] cursor-pointer mb-2.5 p-2.5 hover:bg-[#494391]"
            onClick={() => onItemClick(item)}
          >
            <span className="grow font-medium">{item}</span>
            <span className="text-base ml-[5px]">➔</span>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Sidebar;
