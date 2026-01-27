const BASE_URL = "/auth";

export const authService = {
  async register(email, password) {
    return fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },
  async login(email, password) {
    const url = `${BASE_URL}/login?useCookies=true&useSessionCookies=false`;    
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },
  async logout() {
    return fetch(`${BASE_URL}/logout`, { method: "POST" });
  }
};