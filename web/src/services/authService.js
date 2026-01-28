const BASE_URL = "api/Auth";

export const authService = {
  async checkSession() {
    const url = `${BASE_URL}/manage/info`;
    return fetch(url, {
      method: "GET",
      credentials: 'include',
    });
  },
  async register(email, password) {
    const url = `${BASE_URL}/register`;
    return fetch(url, {
      method: "POST",
      credentials: 'include', // Important to auto-login the user
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },
  async login(email, password) {
    const url = `${BASE_URL}/login`;    
    return fetch(url, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },
  async logout() {
    return fetch(`${BASE_URL}/logout`, { 
      method: "POST", 
      credentials: 'include', 
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};