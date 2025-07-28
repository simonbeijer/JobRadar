import { UserProvider } from "../context/userContext";
import { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <UserProvider>
      <header className="relative flex justify-between items-center h-12 px-4">
        <div />
        <nav className="absolute left-1/2 transform -translate-x-1/2">
          My navbar logged out
        </nav>
        <div />
      </header>
      <main>{children}</main>
    </UserProvider>
  );
}
