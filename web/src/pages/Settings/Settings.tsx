// Settings.tsx
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import ProfileSettings from './Profile/ProfileSettings';
import UserSettings from './User/UserSettings';
import AdminSettings from './Admin/AdminSettings';
import './Settings.css';

export default function Settings() {
  return (
    <div className="settings-container">
      {/* Sub-Menu */}
      <nav className="settings-tabs">
        <NavLink to="profile" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
          Profile
        </NavLink>
        <NavLink to="user" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
          User
        </NavLink>
        <NavLink to="admin" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
          Admin
        </NavLink>
      </nav>

      {/* Sub-Routing Logic */}
      <div className="settings-content">
        <Routes>
          {/* Relative to /settings */}
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="user" element={<UserSettings />} />
          <Route path="admin" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
}