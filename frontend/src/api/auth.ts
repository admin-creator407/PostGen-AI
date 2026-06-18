import api from './axios';
import { AuthResponse } from '../types';

export const loginUser = async (credentials: Record<string, string>): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: Record<string, string>): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<{ user: any }> => {
  const response = await api.get('/auth/me');
  return response.data;
};
