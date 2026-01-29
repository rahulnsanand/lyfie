const BASE_URL = "api/Auth";

// 1. Define types that match your .NET Core Identity models
export interface AuthResponse {
  email: string;
  isEmailConfirmed: boolean;
  // add other fields returned by /manage/info
}

export interface AuthError {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]>;
}

export const authService = {
  async checkSession(): Promise<Response> {
    const url = `${BASE_URL}/me`;
    return fetch(url, {
      method: "GET",
      credentials: 'include',
    });
  },

  async register(email: string, password: string): Promise<Response> {
    const url = `${BASE_URL}/register`;
    return fetch(url, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },

  async login(email: string, password: string): Promise<Response> {
    const url = `${BASE_URL}/login`;    
    return fetch(url, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },

  async logout(): Promise<Response> {
    return fetch(`${BASE_URL}/logout`, { 
      method: "POST", 
      credentials: 'include', 
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};