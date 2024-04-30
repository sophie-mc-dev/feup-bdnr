import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <TopBar></TopBar>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/artists" element={<AllArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/new_event" element={<NewEventPage />} />
          <Route path="/profile" element={<ProfileLayout />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shopping-cart" element={<ShoppingCartPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
