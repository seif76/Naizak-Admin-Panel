'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProtectedRoute({ 
  children,
  fallback = null 
}) {
  const { isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // All role and permission checks have been removed. 
  // If the user is authenticated, they can view the children.
  return children;
}

// Permission-based route components (now just basic auth guards to prevent import errors)
export function CustomersRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function CaptainsRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function DeliverymenRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function VendorsRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function OrdersRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function AnalyticsRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function SupportRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function SettingsRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function SuperAdminRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}