import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService'; 
import './Dashboard.css';

// 1. Define the shape of props
interface DashboardProps {
  onLogout: () => void; // A function that takes no arguments and returns nothing
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    authService.logout(); // TypeScript will check if this method exists
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {/* Could add a Logout button here to use that handleLogoutClick */}
        <button onClick={handleLogoutClick} className="logout-button">
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <section className="stats-grid">
          {/* Using a simple array and mapping is better than repeating divs */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="stat-card">
              <h3>Welcome back!</h3>
              <p>You are successfully logged into Lyfie.</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}