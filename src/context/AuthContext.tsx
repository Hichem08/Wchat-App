import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { CURRENT_USER } from '../constants/mockData';

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  login: (credentials: { emailOrPhone: string; password?: string }) => boolean;
  signup: (data: { fullName: string; email: string; phone: string; matricule?: string; password?: string }) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('wchat_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return CURRENT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('wchat_is_authenticated') === 'true';
  });

  const login = ({ emailOrPhone }: { emailOrPhone: string; password?: string }) => {
    setIsAuthenticated(true);
    localStorage.setItem('wchat_is_authenticated', 'true');
    if (emailOrPhone) {
      const updated = {
        ...user,
        email: emailOrPhone.includes('@') ? emailOrPhone : user.email,
        phone: !emailOrPhone.includes('@') ? emailOrPhone : user.phone,
      };
      setUser(updated);
      localStorage.setItem('wchat_user', JSON.stringify(updated));
    }
    return true;
  };

  const signup = ({ fullName, email, phone, matricule }: { fullName: string; email: string; phone: string; matricule?: string }) => {
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: fullName || 'User',
      email: email || 'user@wchat.app',
      phone: phone || '+1 555 000 0000',
      matricule: matricule || '2025' + Math.floor(100 + Math.random() * 900),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isOnline: true,
      statusText: 'New to Wchat ✨',
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('wchat_user', JSON.stringify(newUser));
    localStorage.setItem('wchat_is_authenticated', 'true');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('wchat_is_authenticated', 'false');
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('wchat_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
