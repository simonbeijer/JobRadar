import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalFooter from "./components/conditionalFooter";
import { ReactNode } from "react";

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

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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
