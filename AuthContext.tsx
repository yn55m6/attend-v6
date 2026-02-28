import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const adminDoc = await getDoc(doc(db, 'settings', 'admin'));
      if (adminDoc.exists() && adminDoc.data().password === password) {
        setIsLoggedIn(true);
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isAdminAuthenticated');
  };

  const changePassword = async (newPassword: string) => {
    try {
      await updateDoc(doc(db, 'settings', 'admin'), {
        password: newPassword
      });
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, changePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};