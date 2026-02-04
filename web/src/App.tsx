import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Authentication from './pages/Authentication/Authentication';
import { PublicRoute, ProtectedRoute } from './components/AuthGuards';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import { authService } from './services/authService';
import AnimatedPage from './pages/AnimatedPage';
import './App.css';
import { db } from './db/database';

type Theme = 'light' | 'dark';

export default function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const checkAuthStatus = async () => {
    try {
      await authService.checkSession();
      setIsAuthenticated(true);
    } catch (error: any) {
      const status = error.response?.status;

      // IF SERVER IS DOWN (No response) OR CRASHED (500 range)
      if (!error.response || (status >= 500 && status <= 599)) {
        const localSession = await authService.getLocalSession();
        
        if (localSession) {
          console.warn("Server error/offline. Using local session.");
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } 
      // IF COOKIE IS EXPIRED (401)
      else if (status === 401) {
        console.error("Session expired on server.");
        await db.session.clear(); // Wipe Dexie so we don't try again
        setIsAuthenticated(false);
      } 
      else {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const effectRan = useRef(false);
  useEffect(() => {
    if (effectRan.current === false) {
      checkAuthStatus();
      
      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout(); // Tells server to delete the cookie
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      // Always clear the UI state regardless of server response
      setIsAuthenticated(false);
    }
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
            <Route path="/auth" element={
              <AnimatedPage>
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Authentication onLogin={() => setIsAuthenticated(true)} />                  
                </PublicRoute>
              </AnimatedPage>
            } />

            {/* Protected Routes Block */}
            {[
              "/dashboard", "/settings", "/admin/settings", 
              "/journal", "/habits", "/ledger", "/vault"
            ].map((path) => (
              <Route 
                key={path}
                path={path} 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            ))}
            
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}