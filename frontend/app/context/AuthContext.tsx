"use client"
import {createContext, useContext, useState} from 'react';

const AuthContext = createContext(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem('authToken');
    }
  });

  const saveToken = (token) => {
    setAuthToken(token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem('authToken', token);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};