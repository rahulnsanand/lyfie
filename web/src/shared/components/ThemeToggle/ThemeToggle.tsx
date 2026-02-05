import { SunIcon, MoonIcon } from "@phosphor-icons/react";
import './ThemeToggle.css';

interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
}

export default function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  const isDark = theme === 'dark';
  const label = isDark ? "Switch to Light" : "Switch to Dark";

  return (
    <div className="tooltip-container">
      <button 
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label={label}
      >
        {isDark ? (
          <SunIcon size={24} weight="bold" />
        ) : (
          <MoonIcon size={24} weight="bold" />
        )}
      </button>
      <span className="tooltip-text">{label}</span>
    </div>
  );
}