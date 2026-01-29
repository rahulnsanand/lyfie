import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import { PublicRoute, ProtectedRoute } from './components/AuthGuards';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import { authService } from './services/authService'; // Import Auth service
import './App.css';
import AnimatedPage from './pages/AnimatedPage';

export default function App() {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme class/attribute to <html> whenever 'theme' state changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Must match [Route("api/auth")] + Endpoint name
        // And MUST include credentials to send the cookie
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    await authService.logout(); // Deletes cookie on server
    setIsAuthenticated(false);  // Updates UI
  };

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
        onLogout={handleLogout} 
      />
      <main className="app-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={
              <AnimatedPage>
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Login onLogin={() => setIsAuthenticated(true)} />                  
                </PublicRoute>
              </AnimatedPage>
            } />

            <Route path="/register" element={
              <AnimatedPage>
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Register onLogin={() => setIsAuthenticated(true)} />
                </PublicRoute>
              </AnimatedPage>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}