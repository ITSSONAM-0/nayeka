import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../components/Toast';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, config);
  const text = await response.text();
  
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { success: false, message: 'Server parsing error' };
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData);
        localStorage.setItem('token', userData.token);
        // Remove token from user object before storing to avoid redundancy
        const { token, ...profile } = userData;
        localStorage.setItem('user', JSON.stringify(profile));
        toast.success(`Welcome back, ${profile.fullName}!`);
        return profile;
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData);
        localStorage.setItem('token', userData.token);
        const { token, ...profile } = userData;
        localStorage.setItem('user', JSON.stringify(profile));
        toast.success('Registration successful! Welcome to NayePankh.');
        return profile;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  const updateProfile = (updatedProfile) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedProfile };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
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
