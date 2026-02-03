import { 
  MagnifyingGlassIcon, 
  SmileyIcon,
  UserCircleIcon, 
  SparkleIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  RepeatIcon, 
  BookOpenIcon, 
  WalletIcon, 
  TargetIcon, 
  DropIcon, 
  PushPinIcon 
} from "@phosphor-icons/react";
import './Dashboard.css';

interface BentoBox {
  id: string;
  title: string;
  className: string;
  icon: React.ReactNode; // New field for icons
  content: React.ReactNode;
}

export default function Dashboard() {
  const bentoItems: BentoBox[] = [
    { 
      id: 'search', title: 'Search', className: 'col-9 row-1', 
      icon: <MagnifyingGlassIcon size={20} weight="bold" />, 
      content: <input type="text" placeholder="Type to search..." className="search-input" /> 
    },    
    { 
      id: 'mood', title: 'Mood', className: 'col-3 row-1', 
      icon: <SmileyIcon size={20} weight="bold" />, 
      content: <div className="mood-icons">☀️ ☁️ 🌧️</div> 
    },
    { 
      id: 'profile', title: 'Profile', className: 'col-3 row-2', 
      icon: <UserCircleIcon size={20} weight="bold" />, 
      content: <div className="avatar-circle">JD</div> 
    },
    { 
      id: 'quote', title: 'AI Quote', className: 'col-6 row-2', 
      icon: <SparkleIcon size={20} weight="bold" color="#eab308" />, 
      content: <p className="italic">"The habit of persistence is victory."</p> 
    },
    { 
      id: 'event', title: 'Event', className: 'col-3 row-2', 
      icon: <CalendarIcon size={20} weight="bold" />, 
      content: <div className="event-tag">Meeting 2PM</div> 
    },
    { 
      id: 'tasks', title: 'Tasks', className: 'col-4 row-3', 
      icon: <CheckCircleIcon size={20} weight="bold" />, 
      content: <ul><li>Read 10 mins</li><li>Push code</li></ul> 
    },
    { 
      id: 'habits', title: 'Habits', className: 'col-4 row-3', 
      icon: <RepeatIcon size={20} weight="bold" />, 
      content: <div className="habit-grid">Habit Tracker</div> 
    },
    { 
      id: 'journal', title: 'Journal', className: 'col-4 row-3', 
      icon: <BookOpenIcon size={20} weight="bold" />, 
      content: <textarea placeholder="How was today?" /> 
    },
    { 
      id: 'expenses', title: 'Finance', className: 'col-6 row-2', 
      icon: <WalletIcon size={20} weight="bold" />, 
      content: <div className="chart-placeholder">Expense Graph</div> 
    },
    { 
      id: 'goals', title: 'Goals', className: 'col-3 row-2', 
      icon: <TargetIcon size={20} weight="bold" />, 
      content: <p>Weekly: 80%</p> 
    },
    { 
      id: 'period', title: 'Cycle', className: 'col-3 row-2', 
      icon: <DropIcon size={20} weight="bold" color="#ef4444" />, 
      content: <p>Day 14</p> 
    },
    { 
      id: 'notes', title: 'Sticky', className: 'col-12 row-1', 
      icon: <PushPinIcon size={20} weight="bold" />, 
      content: <p>Buy milk, fix the bento bug.</p> 
    },
  ];

  return (
    <main className="dashboard-container">
      <div className="bento-grid-12">
        {bentoItems.map((item) => (
          <section key={item.id} className={`bento-item ${item.className}`}>
            <header className="item-header">
              <span className="header-title">
                {item.icon}
                {item.title}
              </span>
            </header>
            <div className="item-content">{item.content}</div>
          </section>
        ))}
      </div>
    </main>
  );
}