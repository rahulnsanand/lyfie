import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { PublicRoute, ProtectedRoute } from './components/AuthGuards';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import { authService } from './services/authService'; // Import Auth service
import './App.css';

export default function App() {
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
    <BrowserRouter>
      <Navbar 
        isLoggedIn={isAuthenticated} 
        theme={theme}
        toggleTheme={toggleTheme} 
        onLogout={handleLogout} 
      />
      <main className="app-content">
        <Routes>
          <Route path="/login" element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Login onLogin={() => setIsAuthenticated(true)} />
            </PublicRoute>
          } />

          <Route path="/register" element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Register onLogin={() => setIsAuthenticated(true)} />
            </PublicRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}