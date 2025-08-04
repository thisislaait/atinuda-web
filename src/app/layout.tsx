import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Nav/HeaderNav";
import SummitFooter from "../components/layout/SummitFooter";
import { Toaster } from "react-hot-toast";

// 👇 import your context provider
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "Atinuda Summit",
  description: "Leading African Event & Creative Summit",
  

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* 👇 Now your entire site has access to auth context */}
        <AuthProvider>
          <Navbar />
          <AuthModal />
          {children}
          <SummitFooter />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
