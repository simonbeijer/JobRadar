import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalFooter from "./components/conditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "jobRadar",
  description: "Track and manage your job search efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          {children}
          <ConditionalFooter />
      </body>
    </html>
  );
}
