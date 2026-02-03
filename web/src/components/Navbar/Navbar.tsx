import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { HouseIcon, MagnifyingGlassIcon, SignOutIcon, XIcon } from "@phosphor-icons/react";
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

interface NavbarProps {
  isLoggedIn: boolean;
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
}

export default function Navbar({ isLoggedIn, theme, toggleTheme, onLogout }: NavbarProps) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (isAuthPage || !isLoggedIn) return null;
  return (
      <nav className={`navbar ${isSearchOpen ? 'search-mode' : ''}`}>
        {/* Brand - hidden on mobile when search is active */}
        <div className="navbar-left">
          <Link to="/" className="logo-text">lyfie</Link>
        </div>

        {/* Search Section */}
        <div className={`navbar-search ${isSearchOpen ? 'active' : ''}`}>
          <div className="search-wrapper">
            <MagnifyingGlassIcon size={20} weight="bold" className="search-icon" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="global-search-input"
              autoFocus={isSearchOpen}
            />
            {/* Close button for mobile search */}
            <button className="search-close-btn" onClick={() => setIsSearchOpen(false)}>
              <XIcon size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Mobile Search Trigger Icon */}
          <button className="mobile-search-trigger" onClick={() => setIsSearchOpen(true)}>
            <MagnifyingGlassIcon size={24} weight="bold" />
          </button>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />    

          <div className="nav-links">
            <Link to="/dashboard" className="nav-icon-link" title="Dashboard">
              <HouseIcon size={24} weight="duotone" />
            </Link>
            <button onClick={onLogout} className="logout-icon-btn" title="Logout">
              <SignOutIcon size={24} weight="bold" />
            </button>
          </div>
        </div>
      </nav>
    );
}