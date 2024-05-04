import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AllArtistsPage from './pages/AllArtistsPage';
import ArtistPage from './pages/ArtistPage';
import EventPage from './pages/EventPage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NewEventPage from './pages/NewEventPage';
import PurchasesPage from './pages/PurchasesPage';
import RegisterPage from './pages/RegisterPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import TicketsPage from './pages/TicketsPage';
import ProfileLayout from './components/ProfileLayout';
import TopBar from './components/TopBar';
import ProfilePage from './pages/ProfilePage';
import Footer from "./components/Footer";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div>
          <TopBar />
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/artists" element={<AllArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/event/:id" element={<EventPage />} />
          
          <Route element={<PrivateRoute />} >
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/new_event" element={<NewEventPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/shopping-cart" element={<ShoppingCartPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
          </Route>
        </Routes>
        <Footer />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
