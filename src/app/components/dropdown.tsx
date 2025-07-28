"use client";
import { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Spinner from "./spinner";
import { User } from "@/types";

interface DropdownProps {
  user: User | null;
  logoutUser: () => void;
}

export default function Dropdown({ user, logoutUser }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 7000);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button 
        className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" 
        onClick={toggleDropdown}
      >
        <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300"></UserCircleIcon>
      </button>
      <div
        className={`transition-all duration-300 transform absolute right-0 mt-2 p-4 border rounded-lg shadow-lg text-right bg-white dark:bg-gray-800 text-foreground border-gray-200 dark:border-gray-700 min-w-[150px] ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {user ? (
          <>
            <p className="text-sm font-medium mb-2">{user.name}</p>
            <button
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
              onClick={logoutUser}
            >
              Logout
            </button>
          </>
        ) : (
          <div className="h-[60px] w-[60px] flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
