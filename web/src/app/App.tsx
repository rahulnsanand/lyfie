import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Hooks & Services
import { useAuth } from '@shared/hooks/AuthContext';
import { useTheme } from '@shared/hooks/useTheme';

// Components
import { PublicRoute, ProtectedRoute } from '@shared/guards/AuthGuards';
import Navbar from '@shared/components/Navbar/Navbar';
import { AnimatedRoutes } from '@shared/routes/AnimatedRoute';

// Pages
import Login from '@features/auth/pages/Login';
import Dashboard from '@features/dashboard/pages/Dashboard';
import Settings from '@features/settings/Settings';

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
      <Navbar
        isLoggedIn={isAuthenticated}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="app-content">
        <ScrollToTop />
        <AnimatedRoutes>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/auth" element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <Login onLogin={login} />
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>} />
            <Route path="/settings/*" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Settings /></ProtectedRoute>} />

            {/* Redirects */}
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatedRoutes>
      </main>
    </div>
  );
}