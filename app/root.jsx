import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home';
import { GamePage } from './pages/game';
import { ProfilePage } from './pages/profile';
import { Settings } from './pages/settings';
import { BrowsePage } from './pages/browse';
import { Layout } from './components/Layout';
import './globals.css';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/games"
          element={
            <Layout>
              <GamePage />
            </Layout>
          }
        />
        <Route
          path="/games/:id"
          element={
            <Layout>
              <GamePage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route
          path="/browse"
          element={
            <Layout>
              <BrowsePage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
