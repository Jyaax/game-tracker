import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import { GamePage } from "./pages/game";
import { LibraryPage } from "./pages/library";
import { ProfilePage } from "./pages/profile";
import { Settings } from "./pages/settings";
import { BrowsePage } from "./pages/browse";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./globals.css";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <AuthProvider>
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
            path="/browse"
            element={
              <Layout>
                <BrowsePage />
              </Layout>
            }
          />
          <Route
            path="/library"
            element={
              <Layout>
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
