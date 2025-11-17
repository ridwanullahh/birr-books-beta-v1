'use client';

import { useEffect, useState, useCallback } from 'react';
import { AuthService } from '@/lib/auth-service';

export interface AuthUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: string;
  verified: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // In production, verify token with backend
      setUser(JSON.parse(localStorage.getItem('authUser') || 'null'));
    }
    setLoading(false);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Registration failed');
        }

        const data = await response.json();
        return { success: true, data };
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Login failed');
        }

        const data = await response.json();

        if (data.token) {
          localStorage.setItem('authToken', data.token);
          setToken(data.token);
        }

        return { success: true, data };
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setUser(null);
      setToken(null);
    } catch (err: any) {
      setError(err.message);
    }
  }, [token]);

  return { user, token, loading, error, register, login, logout, isAuthenticated: !!token };
}
