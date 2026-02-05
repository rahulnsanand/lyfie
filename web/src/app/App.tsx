import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Hooks & Services
import { useAuthManager } from '@shared/hooks/useAuthManager';
import { useTheme } from '@shared/hooks/useTheme';

// Components
import { PublicRoute, ProtectedRoute } from '@shared/guards/AuthGuards';
import Navbar from '@shared/components/Navbar/Navbar';
import AnimatedPage from '@shared/components/AnimatedPage';

// Pages
import Login from '@features/auth/pages/Login';
import Dashboard from '@features/dashboard/pages/Dashboard';
import Settings from '@features/settings/pages/Settings';

import './App.css';

export default function App() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isLoading, login, logout } = useAuthManager();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Lyfie...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar 
        isLoggedIn={isAuthenticated} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onLogout={logout} 
      />
      <main className="app-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/auth" element={
              <AnimatedPage>
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Login onLogin={login} />
                </PublicRoute>
              </AnimatedPage>
            } />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>} />
            <Route path="/settings/*" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Settings /></ProtectedRoute>} />

            {/* Redirects */}
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}