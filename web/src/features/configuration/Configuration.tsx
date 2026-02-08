import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { HouseIcon } from "@phosphor-icons/react";
import ProfileSettings from '@features/configuration/profile/ProfileSettings';
import UserSettings from '@features/configuration/settings/UserSettings';
import AdminSettings from '@features/configuration/administration/AdminSettings';
import Breadcrumbs from "@shared/components/Breadcrumbs/Breadcrumbs";
import './Configuration.css';

const SETTINGS_TABS = [
  {
    key: "profile",
    label: "Profile",
    path: "/configuration/profile",
  },
  {
    key: "user",
    label: "Settings",
    path: "/configuration/user",
  },
  {
    key: "admin",
    label: "Administration",
    path: "/configuration/admin",
  },
];

export default function Settings() {
  const location = useLocation();

  const activeTab =
    SETTINGS_TABS.find(tab =>
      location.pathname.startsWith(tab.path)
    ) ?? SETTINGS_TABS[0];

  return (
    <div className="settings-container">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/dashboard", icon: <HouseIcon size={14} weight="fill" />, },
          { name: "Configuration", href: "/configuration" },
          { name: activeTab.label },
        ]}
      />

      {/* Sub-Menu */}
      <nav className="settings-tabs">
        {SETTINGS_TABS.map(tab => (
          <NavLink
            key={tab.key}
            to={tab.path}
            className={({ isActive }) =>
              `tab ${tab.key} ${isActive ? 'active' : ''}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* Sub-Routing Logic */}
      <div className="settings-content">
        <Routes>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="user" element={<UserSettings />} />
          <Route path="admin" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
}
