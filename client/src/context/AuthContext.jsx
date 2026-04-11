import { createContext, useState, useEffect } from 'react';
import apiService from '../api/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true); // Track initial setup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in (from localStorage) on app mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    
    // Mark initialization as complete
    setInitializing(false);
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.login(email, password, role);
      
      if (response.success) {
        // Save user and token from nested data structure
        const userData = response.data?.user || response.user;
        const token = response.data?.token || response.token;
        
        if (!token) {
          throw new Error('No authentication token received from server');
        }
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (err) {
      const errorMsg = err.message || 'Login request failed';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.register(firstName, lastName, email, password, role);
      
      if (response.success) {
        // Save user and token from nested data structure
        const userData = response.data?.user || response.user;
        const token = response.data?.token || response.token;
        
        if (!token) {
          throw new Error('No authentication token received from server');
        }
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setError(response.message || 'Registration failed');
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (err) {
      const errorMsg = err.message || 'Registration request failed';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, initializing, login, logout, register, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
