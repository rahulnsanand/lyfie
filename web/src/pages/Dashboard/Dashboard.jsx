import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Dashboard.css';

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        
      </header>
      
      <div className="dashboard-content">
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Welcome back!</h3>
            <p>You are successfully logged into Lyfie.</p>
          </div>
          <div className="stat-card">
            <h3>Welcome back!</h3>
            <p>You are successfully logged into Lyfie.</p>
          </div>
          <div className="stat-card">
            <h3>Welcome back!</h3>
            <p>You are successfully logged into Lyfie.</p>
          </div>
          <div className="stat-card">
            <h3>Welcome back!</h3>
            <p>You are successfully logged into Lyfie.</p>
          </div>
          <div className="stat-card">
            <h3>Welcome back!</h3>
            <p>You are successfully logged into Lyfie.</p>
          </div>
          {/* Add more cards here as you build your .NET API */}
        </section>
      </div>
    </div>
  );
}