import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Hooks & Services
import { useAuth } from '@shared/hooks/AuthContext';
import { useTheme } from '@shared/hooks/useTheme';

// Components
import { PublicRoute, ProtectedRoute } from '@shared/guards/AuthGuards';
import Navbar from '@shared/components/Navbar/Navbar';
import { AnimatedRoutes } from '@shared/routes/AnimatedRoute';

// Pages
import Login from '@features/auth/Login';
import Dashboard from '@features/dashboard/Dashboard';
import Settings from '@features/configuration/Configuration';
import Journal from '@features/journal/Journal';

import './App.css';
import { ScrollToTop } from '@shared/routes/ScrollToTop';

export default function App() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Lyfie...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* FULL-WIDTH NAVBAR */}
      <Navbar
        isLoggedIn={isAuthenticated}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* FULL-WIDTH MAIN */}
      <main className="app-content">
        <ScrollToTop />
        <AnimatedRoutes>
          <div className="content-container">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/auth"
                element={
                  <PublicRoute isAuthenticated={isAuthenticated}>
                    <Login onLogin={login} />
                  </PublicRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/configuration/*"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/journal/*"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Journal />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/"
                element={
                  <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </AnimatedRoutes>
      </main>
    </div>
  );
}
