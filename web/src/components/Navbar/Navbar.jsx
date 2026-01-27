import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

export default function Navbar({ isLoggedIn, toggleTheme, onLogout }) {
  const location = useLocation();

  // Hide specific items if we are on login or register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Only show Logo if NOT on an auth page OR if logged in */}
        {(!isAuthPage || isLoggedIn) && (
          <Link to="/" className="logo-text">
            lyfie
          </Link>
        )}
      </div>

      <div className="navbar-actions">
        <ThemeToggle toggleTheme={toggleTheme} />        

        {/* Logged In Links */}
        {isLoggedIn && (
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button 
              onClick={onLogout}
              className="logout-nav-btn"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}