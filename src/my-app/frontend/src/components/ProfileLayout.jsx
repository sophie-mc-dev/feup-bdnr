import React, { useState } from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import ProfilePage from "../pages/ProfilePage";
import TicketsPage from "../pages/TicketsPage";
import FavoritesPage from "../pages/FavoritesPage";
import PurchasesPage from "../pages/PurchasesPage";

const ProfileLayout = () => {
  const [selectedContent, setSelectedContent] = useState("My Profile");
 
  return (
     <div className="min-h-screen bg-gray-100 flex flex-col">
       <TopBar />
       <div className="flex-grow flex">
         <Sidebar profileType="user" onItemClick={setSelectedContent} />
         <div className="flex-grow p-8 bg-white rounded-lg shadow-lg overflow-y-auto">
           {selectedContent === "My Profile" && <ProfilePage />}
           {selectedContent === "My Tickets" && <TicketsPage />}
           {selectedContent === "My Liked Events" && <FavoritesPage />}
           {selectedContent === "My Purchases" && <PurchasesPage />}
         </div>
       </div>
     </div>
  );
 };

export default ProfileLayout;
