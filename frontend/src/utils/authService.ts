
import apiRequest from './api';
// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import { User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const signup = async (name: string, email: string, password: string): Promise<any> => {
  return apiRequest<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role: 'client' }),
  });
};

export const storeAuthData = (token: string, user: User) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
};

export const getStoredAuthData = (): { token: string; user: User } | null => {
  const token = localStorage.getItem('authToken');
  const userString = localStorage.getItem('authUser');

  if (token && userString) {
    try {
      const user: User = JSON.parse(userString);
      return { token, user };
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      clearAuthData();
      return null;
    }
  }
  return null;
};
