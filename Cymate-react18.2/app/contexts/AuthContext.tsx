'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types/auth';
import { authService } from '../lib/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Store user data in localStorage
  const storeUserData = (userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify({
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        id: userData.id
      }));
    }
  };

  // Get user data from localStorage
  const getUserDataFromStorage = (): User | null => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('user_data');
      if (storedData) {
        try {
          return JSON.parse(storedData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user_data');
        }
      }
    }
    return null;
  };

  // Clear user data from localStorage
  const clearUserData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data');
    }
  };

  const fetchUser = async () => {
    if (!authService.isAuthenticated()) {
      // Check if we have stored user data
      const storedUser = getUserDataFromStorage();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
      return;
    }

    try {
      const result = await authService.getUserDetails();
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        // Store user data in localStorage
        storeUserData(result.user);
      } else {
        // Token might be invalid, clear it
        localStorage.removeItem('auth_token');
        clearUserData();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('auth_token');
      clearUserData();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.login({ email, password });
      if (result.success) {
        await fetchUser(); // Fetch user details after successful login
        return true;
      } else {
        toast.error('Login Failed', {
          description: result.message || 'Please check your credentials.',
        });
        return false;
      }
    } catch (error) {
      toast.error('Error', {
        description: 'An unexpected error occurred. Please try again.',
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      clearUserData(); // Clear user data from localStorage
      toast.success('Logged out successfully');
      // Use window.location for redirect since useRouter hook can't be used here
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state anyway
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth_token');
      clearUserData();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 