import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { PublicRoute, ProtectedRoute} from './components/AuthGuards';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import './App.css'; // Standard CSS import

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/auth/manage/info');
        if (response.ok) {
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    // Replaced Tailwind classes with "loading-screen"
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
        toggleTheme={toggleTheme} 
        onLogout={() => setIsAuthenticated(false)} 
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
              <Dashboard onLogout={() => setIsAuthenticated(false)} />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}