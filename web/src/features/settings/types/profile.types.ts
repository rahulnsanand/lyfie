export type Profile = {
  avatarUrl: string;
  displayName: string;
  username: string;
  bio: string;

  timezone: string;
  language: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';

  location: string;
  jobTitle: string;
  organization: string;

  website: string;
  github: string;
  linkedin: string;
};
