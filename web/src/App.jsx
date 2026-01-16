import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // 1. Added useEffect to imports
import Login from './pages/Login';
import { PublicRoute, ProtectedRoute} from './components/AuthGuards';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // We call the built-in .NET Identity info endpoint
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
        setIsLoading(false); // Stop showing the loading screen
      }
    };

    checkAuthStatus();
  }, []);

  // 4. Show a loading spinner or blank screen while checking the cookie
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading Lyfie...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Login onLogin={() => setIsAuthenticated(true)} />
          </PublicRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard onLogout={() => setIsAuthenticated(false)} />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}