import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: (role: UserRole) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('yanama_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('yanama_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('yanama_token', res.data.access_token);
    setUser({
      id: res.data.user_id,
      email: res.data.email,
      full_name: res.data.full_name,
      role: res.data.role as UserRole,
      is_active: true,
      created_at: new Date().toISOString()
    });
  };

  const loginDemo = async (role: UserRole) => {
    const email = role === 'mechanic' ? 'mechanic@yanama.ai' : 'demo@yanama.ai';
    await login(email, 'password123');
  };

  const register = async (email: string, password: string, fullName: string, role: string) => {
    await api.post('/auth/register', {
      email,
      password,
      full_name: fullName,
      role
    });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('yanama_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginDemo,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
