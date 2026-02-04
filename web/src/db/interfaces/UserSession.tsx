export interface UserSession {
  userId: number;
  email: string;
  name: string;
  role: string;
  expiresAt: number;
}