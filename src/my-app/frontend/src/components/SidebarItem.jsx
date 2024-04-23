// SidebarItem.js
import React from "react";

const SidebarItem = ({ item, onItemClick }) => {
  const handleClick = () => {
    if (onItemClick) {
      onItemClick(item); // Notify parent component with the clicked item
    }
  };

  return (
    <div
      className="sidebar-item-link"
      onClick={handleClick}
      style={{ cursor: "pointer" }} // Set cursor to pointer for better UX
    >
      <div className="flex justify-between items-center bg-[#242565] text-white cursor-pointer mb-2.5 p-2.5 hover:bg-[#494391]">
        <span className="grow font-medium">{item}</span>
        <span className="text-base ml-2">➔</span>
      </div>
    </div>
  );
};

export default SidebarItem;
