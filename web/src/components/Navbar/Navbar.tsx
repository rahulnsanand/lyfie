import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

interface NavbarProps {
  isLoggedIn: boolean;
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
}

export default function Navbar({ isLoggedIn, theme, toggleTheme, onLogout }: NavbarProps) {
  const location = useLocation();

  // Hide specific items if we are on login or register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {/* Only show Navbar if NOT on an auth page OR if logged in */}        
      {(!isAuthPage && isLoggedIn) && (
        <nav className="navbar">
          <div className="navbar-brand">
              <Link to="/" className="logo-text">
                lyfie
              </Link>        
          </div>

          <div className="navbar-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />    

            {/* Logged In Links */}
            {isLoggedIn && (
              <div className="nav-links">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button 
                  onClick={onLogout}
                  className="logout-nav-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
}