import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import ProfileSettings from '@features/settings/tabs/profile/ProfileSettings';
import UserSettings from '@features/settings/tabs/settings/UserSettings';
import AdminSettings from '@features/settings/tabs/administration/AdminSettings';
import './Settings.css';

export default function Settings() {
  return (
    <div className="settings-container">
      {/* Sub-Menu */}
      <nav className="settings-tabs">
        <NavLink
          to="/settings/profile"
          className={({ isActive }) =>
            `tab profile ${isActive ? 'active' : ''}`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/settings/app-settings"
          className={({ isActive }) =>
            `tab user ${isActive ? 'active' : ''}`
          }
        >
          Settings
        </NavLink>

        <NavLink
          to="/settings/administration"
          className={({ isActive }) =>
            `tab admin ${isActive ? 'active' : ''}`
          }
        >
          administration
        </NavLink>
      </nav>

      {/* Sub-Routing Logic */}
      <div className="settings-content">
        <Routes>
          {/* Relative to /settings */}
          <Route index element={<Navigate to="/settings/profile" replace />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="user" element={<UserSettings />} />
          <Route path="admin" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
}