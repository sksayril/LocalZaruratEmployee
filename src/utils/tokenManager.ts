/**
 * Token management utility for handling authentication tokens
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'employee_user';

export const tokenManager = {
  // Store authentication token
  setToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  // Get authentication token
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  // Remove authentication token
  removeToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  // Store user data
  setUser: (user: any): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  },

  // Get user data
  getUser: (): any | null => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  },

  // Remove user data
  removeUser: (): void => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to remove user data:', error);
    }
  },

  // Clear all authentication data
  clearAll: (): void => {
    tokenManager.removeToken();
    tokenManager.removeUser();
  },

  // Check if user is authenticated (has valid token)
  isAuthenticated: (): boolean => {
    const token = tokenManager.getToken();
    return !!token;
  }
};
