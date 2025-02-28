import React, { createContext, useContext, useState } from 'react';
import type { AuthContextType, User } from '../types/auth';
import { logger } from '../utils/logger';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for testing
const MOCK_USER: User = {
  id: '1',
  email: 'test@example.com',
  createdAt: new Date(),
  lastLogin: new Date()
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(MOCK_USER);
      logger.debug('Mock sign up:', { email });
    } catch (err) {
      logger.error('Sign up error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(MOCK_USER);
      logger.debug('Mock sign in:', { email });
    } catch (err) {
      logger.error('Sign in error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      logger.debug('Mock sign out');
    } catch (err) {
      logger.error('Sign out error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      logger.debug('Mock password reset:', { email });
    } catch (err) {
      logger.error('Password reset error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
      }
      logger.debug('Mock profile update:', updates);
    } catch (err) {
      logger.error('Profile update error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}