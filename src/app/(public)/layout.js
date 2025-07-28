import { UserProvider } from "../context/userContext";
export default function PublicLayout({ children }) {
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
