'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(pathname);

      if (!isAuthenticated && !isPublicRoute) {
        // User is not authenticated and trying to access protected route
        router.push('/login');
      } else if (isAuthenticated && isPublicRoute) {
        // User is authenticated and trying to access auth pages
        router.push('/dashboard');
      } else if (isAuthenticated && pathname === '/') {
        // User is authenticated and on root page, redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show content if user is authenticated for protected routes
  // or if it's a public route
  const isPublicRoute = publicRoutes.includes(pathname);
  if (isAuthenticated || isPublicRoute) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
} 