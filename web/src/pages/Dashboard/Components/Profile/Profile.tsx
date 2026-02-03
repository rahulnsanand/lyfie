import { MapPin } from "@phosphor-icons/react";
import './Profile.css';

export default function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-main">
        <div className="profile-avatar">RA</div>
        <div className="profile-text">
          <h4 className="profile-name">Rahul</h4>
          <span className="profile-rank">Premium Member</span>
        </div>
      </div>
      
      <footer className="profile-footer">
        <div className="location-tag">
          <MapPin size={14} weight="fill" />
          <span>Bengaluru, IN</span>
        </div>
        <div className="status-indicator">Online</div>
      </footer>
    </div>
  );
}