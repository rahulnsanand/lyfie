import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ isLoggedIn, toggleTheme, onLogout }) {
  const location = useLocation();

  // Hide specific items if we are on login or register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 bg-transparent backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Only show Logo if NOT on an auth page OR if logged in */}
        {(!isAuthPage || isLoggedIn) && (
          <Link to="/" className="font-comfortaa font-bold text-2xl text-green-600">
            lyfie
          </Link>
        )}
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggle toggleTheme={toggleTheme} />        

        {/* Logged In Links */}
        {isLoggedIn && (
          <div className="flex items-center gap-4 font-comfortaa">
            <Link to="/dashboard" className="hover:text-green-500 transition-colors">Dashboard</Link>
            <Link to="/profile" className="hover:text-green-500 transition-colors">Profile</Link>
            <button 
              onClick={onLogout}
              className="bg-red-500/20 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}