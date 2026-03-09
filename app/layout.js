'use client';
import Sidenav from "@/components/navigation/sideNav";
import "./globals.css";
import TopNavbar from "@/components/navigation/Navbar";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import { usePathname } from 'next/navigation';
import SettingsSidenav from "@/components/settings/sidenav";

function LayoutContent({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const pathname = usePathname();
  
  // Show loading while checking auth
  if (loading) {
    return (
      <html lang="en">
        <body className="bg-gray-100">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </body>
      </html>
    );
  }

  // If not authenticated, show only the login page without navigation
  if (!isAuthenticated) {
    return (
      <html lang="en">
        <body className="bg-gray-100">
          {children}
        </body>
      </html>
    );
  }

  // Show main layout for authenticated users
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {/* Fixed Sidebar */}
        {!pathname.startsWith('/settings') && <Sidenav />}
        {pathname.startsWith('/settings') && <SettingsSidenav />}

        {/* Main Layout */}
        <div className="ml-64"> {/* Shift content to the right of the fixed sidebar */}
          <TopNavbar /> {/* Optional: Add fixed class and height if needed */}

          <main className="p-6 pt-20 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <AdminAuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AdminAuthProvider>
  );
}