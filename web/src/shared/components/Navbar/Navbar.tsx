import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { MagnifyingGlassIcon, GearIcon } from "@phosphor-icons/react";
import ThemeToggle from '@shared/components/ThemeToggle/ThemeToggle';
import logo from '@assets/logo.svg';
import './Navbar.css';

interface NavbarProps {
  isLoggedIn: boolean;
  theme: string;
  toggleTheme: () => void;
}

export default function Navbar({ isLoggedIn, theme, toggleTheme }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  /* ===============================
     Scroll Detection (NO FLICKER)
     =============================== */
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, []);

  /* ===============================
     Keyboard Shortcuts
     =============================== */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        return;
      }

      if (
        !isSearchOpen &&
        !isTyping &&
        e.key.length === 1 &&
        e.key.match(/[a-z0-9]/i)
      ) {
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  if (isAuthPage || !isLoggedIn) return null;

  return (
    <>
      {/* Scroll Sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-left">
          <Link
            className="logo-container"
            to="/dashboard"
            onClick={(e) => {
              if (location.pathname === "/dashboard") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <img src={logo} alt="lyfie logo" className="navbar-logo" />
            <span className="logo-text">lyfie</span>
          </Link>
        </div>

        <div className="navbar-actions">
          <div className="tooltip-container">
            <button
              className="search-trigger-btn"
              onClick={() => setIsSearchOpen(true)}
            >
              <MagnifyingGlassIcon size={24} weight="bold" />
            </button>
            <span className="tooltip-text">
              Type anywhere to search or (Ctrl+K)
            </span>
          </div>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          <div className="tooltip-container">
            <Link to="/configuration/profile" className="nav-icon-link">
              <GearIcon size={24} weight="bold" />
            </Link>
            <span className="tooltip-text">Configuration</span>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div
          className="search-modal-overlay"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="search-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
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
