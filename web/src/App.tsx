import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import { PublicRoute, ProtectedRoute } from './components/AuthGuards';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import { authService } from './services/authService';
import AnimatedPage from './pages/AnimatedPage';
import './App.css';

// 1. Define a literal type for Theme
type Theme = 'light' | 'dark';

export default function App() {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 2. State with explicit Type
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

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
        const response = await authService.checkSession();
        console.log("Auth check response:", response);
        setIsAuthenticated(response.ok);
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
    await authService.logout();
    setIsAuthenticated(false);
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
          {/* location and key are essential for AnimatePresence to track route changes */}
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
                <Dashboard />
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