import './ProfileSettings.css';
import AvatarSection from "../../sections/avatar/AvatarSection";
import GlassCard from "@shared/components/GlassEnergyCard/GlassCard";
import IdentitySection from '@features/settings/sections/identity/IdentitySection';
import LocaleSection from '@features/settings/sections/locale/LocaleSection';
import { useAuth } from '@shared/hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

export const mockProfile = {
  avatarUrl: 'https://avatars.githubusercontent.com/u/41159815?v=4',
  displayName: 'Rahul Anand',
  email: 'admin@burgerlife.in',
  bio: 'Building my own personal OS 🚀',

  timezone: 'Asia/Kolkata',
  language: 'en',
  dateOfBirth: 'DD/MM/YYYY',
  timeFormat: '24h',

  location: 'Bangalore, India',
  jobTitle: 'Senior Software Engineer',
  organization: 'Lyfie',

  website: 'https://rahulanand.dev',
  github: 'rahulanand',
  linkedin: 'rahul-anand'
};

export default function ProfileSettings() {
  const profile = mockProfile;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSaveIdentity = (
    data: Partial<{
      displayName: string;
      bio: string;
      dateOfBirth: string;
    }>
  ) => {
    console.log('Saving identity data:', data);

    // later:
    // call API
    // update global state
    // optimistic update, etc.
  };

  const handleLogout = async () => {
    await logout();
  };


  return (
    <>
      
      <GlassCard
        accent="#0369a1"
        energy="fluid-waves"
      >
        <div className="profile-user-content">
          <div className="avatar-column">
            <AvatarSection avatarUrl={profile.avatarUrl} />
          </div>

          <div className="profile-settings-content">
            <IdentitySection
              displayName={profile.displayName}
              email={profile.email}
              bio={profile.bio}
              dateOfBirth={profile.dateOfBirth}
              onSave={handleSaveIdentity}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </GlassCard>      

      
      <br></br>
      <br></br>
      <h3 style={{ paddingLeft: "3rem" }}>Locale & Time</h3>
      <br></br>
      <GlassCard accent="#03a12b"
              energy="fluid-waves"
              className="profile-settings-content">
        <LocaleSection />
      </GlassCard>     
      <br></br>
      <br></br>
      <h3 style={{ paddingLeft: "3rem" }}>Units & Preferences</h3>
      <br></br> 
      <GlassCard accent="#96a103"
              energy="fluid-waves"
              className="profile-settings-content">
        <LocaleSection />
      </GlassCard>     
      <br></br>
      <br></br>
      <br></br> 
    </>
    
    
  );
}

