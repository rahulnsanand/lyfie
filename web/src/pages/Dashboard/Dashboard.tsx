import { useState } from 'react';
import Profile from './Components/Profile/Profile';
import Mood from './Components/Mood/Mood';
import ProfileSettings from './Components/Profile/ProfileSettings';
import './Dashboard.css';

interface WidgetItem {
  id: string;
  title: string;
  grid: string;
  color: string;
  styleType: string;
  // This tells TS the component accepts our custom props
  Component: React.ComponentType<{ onOpenSettings: () => void }>;
}

// Repeat this pattern for Mood, Journal, etc.
const WIDGET_DATA: WidgetItem[] = [
  { 
    id: 'profile', 
    title: '', 
    grid: 'col-3 row-2', 
    color: '#fab1b9', 
    styleType: 'fluid-waves',
    Component: Profile 
  },
  { 
    id: 'profile2', 
    title: '2', 
    grid: 'col-2 row-2', 
    color: '#3f1cda', 
    styleType: 'fluid-waves',
    Component: Mood 
  },  
  { 
    id: 'profile3', 
    title: '3', 
    grid: 'col-3 row-4', 
    color: '#d19b08', 
    styleType: 'fluid-waves',
    Component: Mood 
  },
  { 
    id: 'profile4', 
    title: '4', 
    grid: 'col-4 row-2', 
    color: '#3cbd15', 
    styleType: 'fluid-waves',
    Component: Mood 
  },
  { 
    id: 'profile5', 
    title: '5', 
    grid: 'col-3 row-2', 
    color: '#dd1bd3', 
    styleType: 'dual-pulse',
    Component: Mood 
  },
  { 
    id: 'profile6', 
    title: '6', 
    grid: 'col-2 row-2', 
    color: '#b61024', 
    styleType: 'fluid-waves',
    Component: Mood 
  },
  { 
    id: 'profile7', 
    title: '7', 
    grid: 'col-4 row-2', 
    color: '#cf7601', 
    styleType: 'dual-pulse',
    Component: Mood 
  },
];

export default function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <main className="dashboard-container">
      <div className="bento-grid-12">
        {WIDGET_DATA.map((item) => (
          <section 
            key={item.id} 
            className={`bento-item ${item.grid}`}
            style={{ 
              '--widget-accent': item.color,
              '--widget-accent-deep': `color-mix(in srgb, ${item.color}, black 30%)`,
              '--widget-accent-light': `color-mix(in srgb, ${item.color}, white 30%)`
            } as React.CSSProperties}
            // Trigger settings on card click
            onClick={() => item.id === 'profile' && setIsSettingsOpen(true)}
          >
            <div className={`item-gradient-overlay ${item.styleType}`} />
            
            <header className="item-header" style={{ color: item.color }}>
              {item.title}
            </header>
            <div className="item-content">
              {/* If it's the profile, we can pass the click handler down */}
              <item.Component onOpenSettings={() => setIsSettingsOpen(true)} />
            </div>
          </section>
        ))}
      </div>

      {/* Render the popup outside the grid loop to prevent z-index issues */}
      {isSettingsOpen && (
        <ProfileSettings onClose={() => setIsSettingsOpen(false)} />
      )}
    </main>
  );
}