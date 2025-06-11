import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, User } from "../types/auth";

const API_BASE_URL = "http://127.0.0.1:8000";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  async login(data: LoginCredentials): Promise<{ success: boolean; message?: string; token?: string; user?: any }> {
    try {
      const response = await api.post('/auth/login/', data);
      
      // Store token if provided
      if (response.data.key) {
        localStorage.setItem('auth_token', response.data.key);
      }
      
      return {
        success: true,
        message: "Login successful",
        token: response.data.key,
        user: response.data.user
      };
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    "Login failed. Please check your credentials.";
      return { 
        success: false, 
        message 
      };
    }
  },

  async register(data: RegisterData): Promise<{ success: boolean; message?: string; token?: string; user?: any }> {
    try {
      const payload = {
        username: data.username,
        email: data.email,
        password1: data.password,
        password2: data.confirmPassword,
        first_name: data.firstName,
        last_name: data.lastName,
      };

      const response = await api.post('/auth/registration/', payload);
      
      // Store token if provided
      if (response.data.key) {
        localStorage.setItem('auth_token', response.data.key);
      }
      
      return {
        success: true,
        message: "Registration successful",
        token: response.data.key,
        user: response.data.user
      };
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    "Registration failed. Please try again.";
      return { 
        success: false, 
        message 
      };
    }
  },

  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      await api.post('/auth/logout/');
      localStorage.removeItem('auth_token');
      return {
        success: true,
        message: "Logged out successfully"
      };
    } catch (error: any) {
      // Even if the API call fails, we should still clear the local token
      localStorage.removeItem('auth_token');
      return {
        success: true,
        message: "Logged out successfully"
      };
    }
  },

  async getUserDetails(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await api.get('/auth/user/');
      return {
        success: true,
        user: response.data
      };
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    "Failed to fetch user details";
      return { 
        success: false, 
        message 
      };
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      await api.post('/auth/password/reset/', { email });
      return {
        success: true,
        message: "Password reset email sent successfully"
      };
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    "Password reset failed";
      return { 
        success: false, 
        message 
      };
    }
  },

  async resetPasswordConfirm(uid: string, token: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const payload = {
        uid,
        token,
        new_password1: newPassword,
        new_password2: newPassword
      };
      await api.post('/auth/password/reset/confirm/', payload);
      return {
        success: true,
        message: "Password reset successfully"
      };
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    "Password reset confirmation failed";
      return { 
        success: false, 
        message 
      };
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const payload = {
        old_password: oldPassword,
        new_password1: newPassword,
        new_password2: newPassword
      };
      await api.post('/auth/password/change/', payload);
      return {
        success: true,
        message: "Password changed successfully"
      };
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    "Password change failed";
      return { 
        success: false, 
        message 
      };
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async redirectToLogin(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};