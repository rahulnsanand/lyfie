import Profile from './Components/Profile/Profile';
import './Dashboard.css';

// Repeat this pattern for Mood, Journal, etc.
const WIDGET_DATA = [
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
    Component: Profile 
  },  
  { 
    id: 'profile3', 
    title: '3', 
    grid: 'col-3 row-4', 
    color: '#d19b08', 
    styleType: 'fluid-waves',
    Component: Profile 
  },
  { 
    id: 'profile4', 
    title: '4', 
    grid: 'col-4 row-2', 
    color: '#3cbd15', 
    styleType: 'fluid-waves',
    Component: Profile 
  },
  { 
    id: 'profile5', 
    title: '5', 
    grid: 'col-3 row-2', 
    color: '#dd1bd3', 
    styleType: 'dual-pulse',
    Component: Profile 
  },
  { 
    id: 'profile6', 
    title: '6', 
    grid: 'col-2 row-2', 
    color: '#b61024', 
    styleType: 'fluid-waves',
    Component: Profile 
  },
  { 
    id: 'profile7', 
    title: '7', 
    grid: 'col-4 row-2', 
    color: '#cf7601', 
    styleType: 'dual-pulse',
    Component: Profile 
  },
];

export default function Dashboard() {
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
          >
            {/* Pass the styleType here */}
            <div className={`item-gradient-overlay ${item.styleType}`} />
            
            <header className="item-header" style={{ color: item.color }}>
              {item.title}
            </header>
            <div className="item-content">
              <item.Component />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}