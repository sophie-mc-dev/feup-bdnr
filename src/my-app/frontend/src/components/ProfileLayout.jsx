import React, { useState } from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import ProfilePage from "../pages/ProfilePage";
import TicketsPage from "../pages/TicketsPage";
import FavoritesPage from "../pages/FavoritesPage";
import PurchasesPage from "../pages/PurchasesPage";

const ProfileLayout = () => {
  const [selectedItem, setSelectedItem] = useState("My Profile");

  const handleSidebarItemClick = (item) => {
    setSelectedItem(item);
  };

  // Function to render content based on selected sidebar item
  const renderMainContent = () => {
    switch (selectedItem) {
      case "My Profile":
        return <ProfilePage />;
      case "My Tickets":
        return <TicketsPage />;
      case "My Liked Events":
        return <FavoritesPage />;
      case "My Orders":
        return <PurchasesPage />;

      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <TopBar />

      <div className="flex-grow flex">
        {/* Sidebar */}
        <Sidebar onItemClick={handleSidebarItemClick} />

        {/* Main Content */}
        <div className="flex-grow p-8 bg-white rounded-lg shadow-lg overflow-y-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
