import React from "react";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import AuthProvider from "@/context/AuthContext";
import AlertProvider from "@/context/AlertContext";
import AlertDisplay from "@/components/Alert";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen w-full overflow-hidden flex relative bg-light-blue">
        <AuthProvider>
          <AlertProvider>
            <AlertDisplay />
            <SidebarProvider>
              <Sidebar />
              {children}
            </SidebarProvider>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
