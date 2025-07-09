import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, User } from "../types/auth";

const API_BASE_URL = "http://127.0.0.1:8000";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    console.log('📡 API Request:', config.method?.toUpperCase(), config.url, config.data); // Debug log
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url, response.data); // Debug log
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url, error.response?.data); // Debug log
    return Promise.reject(error);
  }
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

  async register(data: RegisterData): Promise<{ success: boolean; message?: string; token?: string; user?: any; errors?: any }> {
    try {
      // Clean and validate the payload
      const payload = {
        username: data.username.trim(),
        email: data.email.trim(),
        password1: data.password,
        password2: data.confirmPassword,
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
      };

      // Basic validation to ensure no empty fields
      if (!payload.username || !payload.email || !payload.password1 || !payload.password2 || !payload.first_name || !payload.last_name) {
        return {
          success: false,
          message: "All fields are required"
        };
      }

      console.log('🚀 Registration payload:', payload); // Debug log

      const response = await api.post('/auth/registration/', payload);
      
      console.log('✅ Registration successful:', response.data); // Debug log
      
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
      console.error('❌ Registration error:', error); // Debug log
      console.error('❌ Error response:', error.response?.data); // Debug log
      
      // Handle field-specific validation errors
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // If there are field-specific errors
        if (typeof errorData === 'object' && !errorData.detail && !errorData.message) {
          // Return field errors for frontend processing
          return {
            success: false,
            message: "Please correct the errors below",
            errors: errorData
          };
        }
        
        // Handle general error messages
        const message = errorData.detail || 
                       errorData.message || 
                       errorData.non_field_errors?.[0] ||
                       "Registration failed. Please try again.";
        
        return { 
          success: false, 
          message,
          errors: errorData
        };
      }
      
      return { 
        success: false, 
        message: "Registration failed. Please try again."
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

  // Email Verification Methods
  async sendVerificationCode(email: string, verificationType: 'registration' | 'password_reset'): Promise<{ success: boolean; message?: string }> {
    try {
      const payload = {
        email: email.trim(),
        verification_type: verificationType
      };
      
      await api.post('/api/email-verification/send-code/', payload);
      return {
        success: true,
        message: "Verification code sent to your email"
      };
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    error.response?.data?.error ||
                    "Failed to send verification code";
      return { 
        success: false, 
        message 
      };
    }
  },

  async verifyCode(email: string, code: string, verificationType: 'registration' | 'password_reset'): Promise<{ success: boolean; message?: string; token?: string }> {
    try {
      const payload = {
        email: email.trim(),
        code: code.trim(),
        verification_type: verificationType
      };
      
      const response = await api.post('/api/email-verification/verify-code/', payload);
      return {
        success: true,
        message: "Code verified successfully",
        token: response.data.verification_token // For password reset flow
      };
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    error.response?.data?.error ||
                    "Invalid or expired verification code";
      return { 
        success: false, 
        message 
      };
    }
  },

  async enhancedRegistration(data: RegisterData, verificationCode: string): Promise<{ success: boolean; message?: string; token?: string; user?: any; errors?: any }> {
    try {
      const payload = {
        username: data.username.trim(),
        email: data.email.trim(),
        password1: data.password,
        password2: data.confirmPassword,
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        verification_code: verificationCode.trim()
      };

      console.log('🚀 Enhanced registration payload:', payload); // Debug log

      const response = await api.post('/api/auth/enhanced-registration/', payload);
      
      console.log('✅ Enhanced registration successful:', response.data); // Debug log
      
      // Store token if provided
      if (response.data.key) {
        localStorage.setItem('auth_token', response.data.key);
      }
      
      return {
        success: true,
        message: "Registration successful! Your account has been verified.",
        token: response.data.key,
        user: response.data.user
      };
    } catch (error: any) {
      console.error('❌ Enhanced registration error:', error); // Debug log
      console.error('❌ Error response:', error.response?.data); // Debug log
      
      // Handle field-specific validation errors
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // If there are field-specific errors
        if (typeof errorData === 'object' && !errorData.detail && !errorData.message) {
          return {
            success: false,
            message: "Please correct the errors below",
            errors: errorData
          };
        }
        
        // Handle general error messages
        const message = errorData.detail || 
                       errorData.message || 
                       errorData.non_field_errors?.[0] ||
                       "Registration failed. Please try again.";
        
        return { 
          success: false, 
          message,
          errors: errorData
        };
      }
      
      return { 
        success: false, 
        message: "Registration failed. Please try again."
      };
    }
  },

  async resetPasswordWithToken(email: string, verificationToken: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const payload = {
        email: email.trim(),
        new_password: newPassword,
        confirm_password: newPassword,
        verification_token: verificationToken
      };
      
      await api.post('/api/email-verification/reset-password-confirm/', payload);
      return {
        success: true,
        message: "Password reset successfully"
      };
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                    error.response?.data?.message || 
                    error.response?.data?.error ||
                    "Password reset failed";
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