import { Navigate } from 'react-router-dom';

// Only allows access if NOT logged in (Login/Register)
export const PublicRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean; children: React.ReactNode }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Only allows access if logged in (Dashboard/Settings/Habits)
export const ProtectedRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean; children: React.ReactNode }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};