/* Profile.tsx */
import { MapPinIcon } from "@phosphor-icons/react";
import './Profile.css';

interface ProfileProps {
  onOpenSettings?: () => void; // The '?' makes it optional
}

export default function Profile({ onOpenSettings }: ProfileProps) {
  return (
    /* Bind the prop to the onClick event here */
    <div className="profile-inner-layout" onClick={onOpenSettings} style={{ cursor: 'pointer' }}>
      <div className="profile-top-section">
        <div className="profile-avatar">RA</div>
        <div className="profile-meta">
          <h4 className="profile-name">Rahul Anand</h4>
          <span className="profile-email">admin@burgerlife.in</span>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="stat-box">
          <span className="stat-label">Currency</span>
          <span className="stat-value">INR</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Timezone</span>
          <span className="stat-value">IST</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Measurement</span>
          <span className="stat-value">Metric</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Theme</span>
          <span className="stat-value">Dark</span>
        </div>
      </div>

      <footer className="profile-card-footer">
        <div className="dynamic-text-status">
          <span>last active in a day ago</span>
        </div>
      </footer>
    </div>
  );
}