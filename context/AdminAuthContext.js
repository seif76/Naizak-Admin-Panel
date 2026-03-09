'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get('admin_token');
      const adminInfo = localStorage.getItem('admin_info');

      if (token && adminInfo) {
        // Verify token with backend using Bearer token
        const response = await axios.get(`${BACKEND_URL}/api/admin/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAdmin(response.data);
        setIsAuthenticated(true);
      } else {
        // Clear any stale data
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/auth/login`, {
        username,
        password
      });

      const { token, admin: adminData } = response.data;

      // Store token in cookie (frontend only)
      Cookies.set('admin_token', token, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Store admin info in localStorage
      localStorage.setItem('admin_info', JSON.stringify(adminData));

      setAdmin(adminData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint with Bearer token
      const token = Cookies.get('admin_token');
      if (token) {
        await axios.post(`${BACKEND_URL}/api/admin/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local data (frontend only)
      Cookies.remove('admin_token');
      localStorage.removeItem('admin_info');
      setAdmin(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};