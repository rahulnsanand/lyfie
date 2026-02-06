import { useState } from 'react';
import ProfileCard from '@features/dashboard/cards/ProfileCard/ProfileCard';
import Mood from '@features/dashboard/cards/Mood/Mood';
import './Dashboard.css';
import GlassCard, { EnergyStyle } from '@shared/components/GlassEnergyCard/GlassCard';

interface WidgetItem {
  id: string;
  title: string;
  grid: string;
  color: string;
  styleType: EnergyStyle;
  Component: React.ComponentType<{ onOpenSettings?: () => void }>;
}

// Repeat this pattern for Mood, Journal, etc.
const WIDGET_DATA: WidgetItem[] = [
  { 
    id: 'profile', 
    title: '', 
    grid: 'col-3 row-2', 
    color: '#fab1b9', 
    styleType: 'fluid-waves',
    Component: ProfileCard 
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
 
  return (
    <main className="dashboard-container">
      <div className="bento-grid-12">
        {WIDGET_DATA.map((item) => (
          <GlassCard
            key={item.id}
            accent={item.color}
            energy={item.styleType}
            className={`bento-item ${item.grid}`}
          >
            <header className="item-header">{item.title}</header>
            <item.Component />
          </GlassCard>
        ))}
      </div>
    </main>
  );
}