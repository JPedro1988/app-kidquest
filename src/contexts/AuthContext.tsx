'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('kidquest-current-user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setAuthState({
            user: {
              ...user,
              createdAt: new Date(user.createdAt),
            },
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
  }, []);

  const login = (user: User) => {
    setAuthState({
      user,
      isAuthenticated: true,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('kidquest-current-user', JSON.stringify(user));
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kidquest-current-user');
    }
  };

  const updateUser = (user: User) => {
    setAuthState({
      user,
      isAuthenticated: true,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('kidquest-current-user', JSON.stringify(user));
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
