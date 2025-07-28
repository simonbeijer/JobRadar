"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
      console.error('❌ User fetch error:', error.message);
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

export const useUserContext = () => useContext(UserContext);
