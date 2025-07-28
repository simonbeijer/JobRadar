import Header from "../components/header";
import { UserProvider } from "../context/userContext";

export default function AuthLayout({children}) {
    return (
        <UserProvider>
            <Header />
            <main>{children}</main>
        </UserProvider>
    );
}