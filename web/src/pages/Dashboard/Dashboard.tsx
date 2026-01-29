import './Dashboard.css';


export default function Dashboard() {

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
 
      </header>
      
      <div className="dashboard-content">
        <section className="stats-grid">
          {/* Using a simple array and mapping is better than repeating divs */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
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