import React from 'react';
import './Sidebar.css'; // Add styles for the sidebar

const Sidebar = ({ profileType, onItemClick }) => {
    const getUserItems = () => ['Account Settings', 'My Tickets', 'My Liked Events', 'My Orders'];
    const getOrganizationItems = () => ['Account Settings', 'My Events', 'Analytics'];
  
  const mainItems = profileType === 'user' ? getUserItems() : getOrganizationItems();
  const additionalItems = ['Settings', 'Log Out']; 

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        {mainItems.map((item, index) => (
          <div key={index} className="sidebar-item" onClick={() => onItemClick(item)}>
            <span className="sidebar-item-text">{item}</span>
            <span className="sidebar-item-arrow">➔</span>
          </div>
        ))}
      </div>
      <div className="sidebar-section">
        {additionalItems.map((item, index) => (
          <div key={index} className="sidebar-item" onClick={() => onItemClick(item)}>
            <span className="sidebar-item-text">{item}</span>
            <span className="sidebar-item-arrow">➔</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
