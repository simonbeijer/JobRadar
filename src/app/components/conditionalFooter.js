"use client";
import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on login page
  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="flex justify-center items-center h-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <p className="text-sm text-gray-600 dark:text-gray-400">© 2025 jobRadar</p>
    </footer>
  );
}