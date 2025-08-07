'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  requiredRole = null,
  fallback = null 
}) {
  const { isAuthenticated, loading, admin, hasPermission, hasRole } = useAdminAuth();
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

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have the required role to access this page.</p>
        </div>
      </div>
    );
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(({ resource, action }) =>
      hasPermission(resource, action)
    );

    if (!hasAllPermissions) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have the required permissions to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return children;
}

// Permission-based route components
export function CustomersRoute({ children }) {
  return (
    <ProtectedRoute 
      requiredPermissions={[{ resource: 'customers', action: 'view' }]}
      children={children}
    />
  );
}

export function CaptainsRoute({ children }) {
  return (
    <ProtectedRoute 
      requiredPermissions={[{ resource: 'captains', action: 'view' }]}
      children={children}
    />
  );
}

export function VendorsRoute({ children }) {
  return (
    <ProtectedRoute 
      requiredPermissions={[{ resource: 'vendors', action: 'view' }]}
      children={children}
    />
  );
}

export function OrdersRoute({ children }) {
  return (
    <ProtectedRoute 
      requiredPermissions={[{ resource: 'orders', action: 'view' }]}
      children={children}
    />
  );
}

export function AnalyticsRoute({ children }) {
  return (
    <ProtectedRoute 
      requiredPermissions={[{ resource: 'analytics', action: 'view' }]}
      children={children}
    />
  );
}

export function SupportRoute({ children }) {
  return (
    <ProtectedRoute 
      requiredPermissions={[{ resource: 'support', action: 'view' }]}
      children={children}
    />
  );
}

export function SettingsRoute({ children }) {
  return (
    <ProtectedRoute 
      requiredPermissions={[{ resource: 'settings', action: 'view' }]}
      children={children}
    />
  );
}

export function SuperAdminRoute({ children }) {
  return (
    <ProtectedRoute 
      requiredRole="super_admin"
      children={children}
    />
  );
} 