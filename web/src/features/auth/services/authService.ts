import api from '@shared/services/api';
import { db } from "@shared/persistence/database";
import { UserSession } from '@shared/persistence/interfaces/UserSession';

const BASE_URL = "/auth"; // The 'api' instance already has the base URL prefix


export const authService = {
  async getLocalSession(): Promise<UserSession | null> {
    const session = await db.session.toCollection().first();
    if (!session) return null;
    
    // Check if local session is still valid
    if (Date.now() > session.expiresAt) {
      await db.session.clear();
      return null;
    }
    return session;
  },

  async checkSession() {
    // Axios returns a promise with a 'data' property
    const response = await api.get(`${BASE_URL}/status`);
    return response.data;
  },

  async register(name: string, email: string, password: string) {
    const response = await api.post(`${BASE_URL}/register`, { name, email, password });

    // Create the shadow session
    const { user } = response.data; 

    if (!user || !user.id) {
      throw new Error("Login successful, but user data was missing for offline sync.");
    }

    const shadowSession: UserSession = {
      userId: user.id, 
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
    };

    await db.session.clear();
    await db.session.put(shadowSession);

    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post(`${BASE_URL}/login`, { email, password });
    
    // Create the shadow session
    const { user } = response.data; 

    if (!user || !user.id) {
      throw new Error("Login successful, but user data was missing for offline sync.");
    }

    const shadowSession: UserSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
    };

    await db.session.clear();
    await db.session.put(shadowSession);

    return response.data;
  },

  async logout() {
    try {
      await api.post(`${BASE_URL}/logout`);
    } finally {
      // Clear ONLY auth-related tables
      await db.session.clear();
    }
  }
};  