import React from "react";
import { Link } from "react-router-dom";

const SidebarItem = ({ item, to, onItemClick }) => {
  const handleClick = () => {
    if (onItemClick) {
      onItemClick(item); 
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{ cursor: "pointer" }} 
    >
      <Link to={to} className="flex justify-between items-center bg-[#242565] text-white cursor-pointer mb-2.5 p-2.5 hover:bg-[#494391]">
        <span className="grow font-medium">{item}</span>
        <span className="text-base ml-2">➔</span>
      </Link>
    </div>
  );
};

export default SidebarItem;
