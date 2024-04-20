import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllArtistsPage from './pages/AllArtistsPage';
import ArtistPage from './pages/ArtistPage';
import EventPage from './pages/EventPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import PurchasesPage from './pages/PurchasesPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import TicketsPage from './pages/TicketsPage';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Sidebar profileType="user" />} />
          <Route path="/" element={<HomePage />} />

          <Route path="/artists" element={<AllArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/shopping-cart" element={<ShoppingCartPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
