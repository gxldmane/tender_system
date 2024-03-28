"use client"
import {createContext, ReactNode, useContext, useState} from 'react';
import httpClient from "@/app/http";

interface AuthContextType {
  authToken: string;
  saveAuthToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>(null);

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem('auth_token');
    }
  });

  const saveAuthToken = (token: string) => {
    setAuthToken(token);
    httpClient.setToken(token);
    if (typeof window !== "undefined") {
      window.localStorage.setItem('auth_token', token);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, saveAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};