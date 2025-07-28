"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/user", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json()
        console.log('✅ User session restored:', data.user.email);
        setUser(data.user)
      } else {
        console.log('ℹ️ No active user session found');
      }
    } catch (error) {
      console.error('❌ User fetch error:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
