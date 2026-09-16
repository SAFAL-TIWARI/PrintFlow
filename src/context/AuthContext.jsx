import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('printpulse_token') || localStorage.getItem('token') || localStorage.getItem('printpulse_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('printpulse_token');
          localStorage.removeItem('token');
          localStorage.removeItem('printpulse_token');
        }
      } catch (err) {
        console.warn('Auth session invalid or expired:', err.message);
        localStorage.removeItem('printpulse_token');
        localStorage.removeItem('token');
        localStorage.removeItem('printpulse_token');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    // Clear any stale tokens or inspection session before authenticating
    localStorage.removeItem('printpulse_token');
    localStorage.removeItem('token');
    localStorage.removeItem('printpulse_token');
    sessionStorage.removeItem('inspected_shop_id');
    sessionStorage.removeItem('inspected_shop_name');
    sessionStorage.removeItem('inspected_shop_slug');

    const res = await api.login(email, password);
    if (res.success && res.token) {
      localStorage.setItem('printpulse_token', res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (data) => {
    const res = await api.register(data);
    if (res.success && res.requiresApproval) {
      return res;
    }
    if (res.success && res.token) {
      localStorage.setItem('printpulse_token', res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('printpulse_token');
    localStorage.removeItem('token');
    localStorage.removeItem('printpulse_token');
    sessionStorage.removeItem('inspected_shop_id');
    sessionStorage.removeItem('inspected_shop_name');
    sessionStorage.removeItem('inspected_shop_slug');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
