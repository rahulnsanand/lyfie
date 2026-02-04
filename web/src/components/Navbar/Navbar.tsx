import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HouseIcon, MagnifyingGlassIcon, SignOutIcon, XIcon, GearIcon } from "@phosphor-icons/react";
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.svg';
import './Navbar.css';

interface NavbarProps {
  isLoggedIn: boolean;
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
}

export default function Navbar({ isLoggedIn, theme, toggleTheme, onLogout }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const handleScroll = () => {
      // If scroll is more than 20px, condense the navbar
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Check if the user is already typing in an input, textarea, or contentEditable element
      const isTyping = 
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' || 
        (document.activeElement as HTMLElement)?.isContentEditable;

      // 2. Handle Ctrl+K / Cmd+K (Explicit Trigger)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      // 3. Handle Escape to Close
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        return;
      }

      // 4. "Type anywhere to search" 
      // We only trigger if:
      // - Search isn't already open
      // - User isn't typing in another field
      // - It's a single character (a-z, 0-9)
      if (!isSearchOpen && !isTyping && e.key.length === 1 && e.key.match(/[a-z0-9]/i)) {
        setIsSearchOpen(true);
        // Optional: We don't preventDefault here so the first character 
        // actually appears in the search input once it focuses
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]); // Depend on state to check current toggle status

  if (isAuthPage || !isLoggedIn) return null;

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-left">
          <Link to="/" className="logo-container">
            <img src={logo} alt="lyfie logo" className="navbar-logo" />
            <span className="logo-text">lyfie</span>
          </Link>
        </div>

        <div className="navbar-actions">
          <button 
            className="search-trigger-btn" 
            onClick={() => setIsSearchOpen(true)}
            title="Search (Ctrl+K)"
          >
            <MagnifyingGlassIcon size={24} weight="bold" />
          </button>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />    

          <Link to="/settings" className="nav-icon-link" title="Settings">
            <GearIcon size={24} weight="bold" />
          </Link>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="search-modal-overlay" onClick={() => setIsSearchOpen(false)}>
          <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-search-wrapper">
              <MagnifyingGlassIcon size={22} weight="bold" />
              <input 
                type="text" 
                placeholder="Search lyfie..." 
                className="modal-search-input" 
                autoFocus 
              />
              <kbd className="esc-tag">ESC</kbd>
            </div>
          </div>
        </div>
      )}
    </>
  );
}