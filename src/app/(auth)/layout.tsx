import Header from "../components/header";
import { UserProvider } from "../context/userContext";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({children}: AuthLayoutProps) {
    return (
        <UserProvider>
            <Header />
            <main>{children}</main>
        </UserProvider>
    );
}