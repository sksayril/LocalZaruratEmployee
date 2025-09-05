import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateUniqueId } from '../utils/idGenerator';
import { apiLogin, apiSignup, apiSuperEmployeeLogin, SuperEmployeeLoginResponse } from '../services/api';

export type UserRole = 'employee' | 'super-employee';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  employeeId?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  signup: (userData: Omit<SignupData, 'employeeId'>, role: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  employeeId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('employee_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      if (role === 'super-employee') {
        // Use super employee login API
        const response: SuperEmployeeLoginResponse = await apiSuperEmployeeLogin({ email, password });
        
        console.log('Full API response:', response);
        console.log('Response data:', response.data);
        console.log('User data:', response.data?.user);
        
        if (response.success) {
          // Handle the actual API response structure
          const userData = response.data?.user;
          
          if (!userData || !userData._id) {
            console.error('No user data found in response:', response);
            return { success: false, message: 'Invalid response format. Please try again.' };
          }
          
          // Map the response to User interface with safe property access
          const loggedInUser: User = {
            id: userData._id || '',
            email: userData.email || '',
            firstName: userData.name ? userData.name.split(' ')[0] : '',
            lastName: userData.name ? userData.name.split(' ').slice(1).join(' ') : '',
            role: 'super-employee',
            department: userData.superEmployeeDetails?.department || '',
            employeeId: userData.superEmployeeDetails?.employeeId || '',
            token: response.data?.token || ''
          };
          
          console.log('Mapped user data:', loggedInUser);
          
          setUser(loggedInUser);
          localStorage.setItem('employee_user', JSON.stringify(loggedInUser));
          return { success: true, message: 'Login successful!' };
        } else {
          console.error('Login failed - response structure:', response);
          return { success: false, message: response.message || 'Login failed. Please try again.' };
        }
      } else {
        // Use regular employee login API
        const loggedInUser = await apiLogin(email, password, role);
        setUser(loggedInUser);
        localStorage.setItem('employee_user', JSON.stringify(loggedInUser));
        return { success: true, message: 'Login successful!' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: Omit<SignupData, 'employeeId'>, role: UserRole) => {
    setLoading(true);
    try {
      const newUser = await apiSignup({ ...userData, employeeId: generateUniqueId(role) }, role);
      setUser(newUser);
      localStorage.setItem('employee_user', JSON.stringify(newUser));
      return { success: true, message: 'Signup successful!' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, message: error.message || 'Signup failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('employee_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};