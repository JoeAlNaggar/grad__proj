import { AuthResponse, LoginCredentials, RegisterData } from "../types/auth";

const API_BASE_URL = "http://127.0.0.1:8000";

export const authService = {
  async login(data: LoginCredentials): Promise<{ success: boolean; message?: string; token?: string; user?: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Try to get response data if available
        const result = await response.json().catch(() => ({}));
        
        // Store token if provided
        if (result.token) {
          localStorage.setItem('auth_token', result.token);
        }
        
        return {
          success: true,
          message: "Login successful",
          token: result.token,
          user: result.user
        };
      } else {
        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: errorData.detail || errorData.message || "Login failed. Please check your credentials." 
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: "Network error. Please check your connection and try again." 
      };
    }
  },

  async register(data: RegisterData): Promise<{ success: boolean; message?: string; token?: string; user?: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/registration/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password1: data.password,
          password2: data.confirmPassword,
          first_name: data.firstName,
          last_name: data.lastName,
        }),
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({}));
        
        // Store token if provided
        if (result.token) {
          localStorage.setItem('auth_token', result.token);
        }
        
        return {
          success: true,
          message: "Registration successful",
          token: result.token,
          user: result.user
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: errorData.detail || errorData.message || "Registration failed. Please try again." 
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        message: "Network error. Please check your connection and try again." 
      };
    }
  },

  async resetPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        return {
          success: true,
          message: "Password reset email sent successfully"
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: errorData.detail || errorData.message || "Password reset failed" 
        };
      }
    } catch (error) {
      console.error("Password reset error:", error);
      return { 
        success: false, 
        message: "Network error. Please try again." 
      };
    }
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};