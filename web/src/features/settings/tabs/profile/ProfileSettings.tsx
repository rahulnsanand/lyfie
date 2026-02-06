import './ProfileSettings.css';
import AvatarSection from "../../sections/avatar/AvatarSection";
import GlassCard from "@shared/components/GlassEnergyCard/GlassCard";
import IdentitySection from '@features/settings/sections/identity/IdentitySection';
import LocaleSection from '@features/settings/sections/locale/LocaleSection';

export const mockProfile = {
  avatarUrl: 'https://i.pravatar.cc/150?img=32',
  displayName: 'Rahul Anand',
  username: 'rahul',
  bio: 'Building my own personal OS 🚀',

  timezone: 'Asia/Kolkata',
  language: 'en',
  dateFormat: 'DD/MM/YYYY',
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

  return (
    <>
      <AvatarSection avatarUrl={profile.avatarUrl} />  
      <br></br>
      <h3 style={{textAlign: "center"}}>rahulanand2206@gmail.com</h3>
      <br></br>
      <br></br>
      <GlassCard accent="#0369a1"
              energy="fluid-waves"
              className="profile-settings-content">            
        <IdentitySection {...profile} />
      </GlassCard>
      <br></br>
      <br></br>
      <h3 style={{textAlign: "center"}}>Locale & Time</h3>
      <br></br>
      <GlassCard accent="#03a12b"
              energy="fluid-waves"
              className="profile-settings-content">
        <LocaleSection />
      </GlassCard>     
      <br></br>
      <h3 style={{textAlign: "center"}}>logout</h3>
      <br></br>
      <br></br> 
    </>
    
    
  );
}

