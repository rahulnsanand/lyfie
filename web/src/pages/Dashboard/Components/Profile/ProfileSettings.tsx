import { X } from "@phosphor-icons/react";
import './ProfileSettings.css';

export default function ProfileSettings({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Profile Settings</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </header>
        
        <div className="settings-body">
          <div className="input-field">
            <label>Display Name</label>
            <input type="text" placeholder="Rahul Anand" />
          </div>
          <div className="input-field">
            <label>Currency Preference</label>
            <select>
              <option>INR (₹)</option>
              <option>USD ($)</option>
            </select>
          </div>
          <button className="save-button">Update Profile</button>
        </div>
      </div>
    </div>
  );
}