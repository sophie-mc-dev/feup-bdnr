import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import PrivateRoute from "./utils/PrivateRoute";
import AllArtistsPage from "./pages/AllArtistsPage";
import EventPage from "./pages/EventPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PurchasesPage from "./pages/PurchasesPage";
import RegisterPage from "./pages/RegisterPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import TicketsPage from "./pages/TicketsPage";
import ProfileLayout from "./components/ProfileLayout";
import TopBar from "./components/TopBar";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import CommentsPage from "./pages/CommentsPage";
import OrganizationEventsPage from "./pages/OrganizationEventsPage";


function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="min-h-screen flex flex-col">
          <TopBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/artists" element={<AllArtistsPage />} />
            <Route path="/events/:id" element={<EventPage />} />

            <Route element={<PrivateRoute />}>
              {/*Consumer Pages*/}
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/shopping-cart" element={<ShoppingCartPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/comments" element={<CommentsPage />} />

              {/*Organization Pages*/}
              <Route path="/my_events" element={<OrganizationEventsPage/>} />

            </Route>
          </Routes>
          <Footer />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
