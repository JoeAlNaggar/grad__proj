'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/'];

  useEffect(() => {
    if (!isLoading && !isRedirecting) {
      const isPublicRoute = publicRoutes.includes(pathname);

      if (!isAuthenticated && !isPublicRoute) {
        // User is not authenticated and trying to access protected route
        setIsRedirecting(true);
        router.push('/login');
      } else if (isAuthenticated && isPublicRoute && pathname !== '/verify-email') {
        // User is authenticated and trying to access auth pages (except verify-email for registration flow)
        setIsRedirecting(true);
        // Perform a refresh when coming from login to ensure fresh state
        if (pathname === '/login') {
          window.location.href = '/dashboard';
        } else {
          router.push('/dashboard');
        }
      } else if (isAuthenticated && pathname === '/') {
        // User is authenticated and on root page, redirect to dashboard
        setIsRedirecting(true);
        window.location.href = '/dashboard';
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isRedirecting]);

  // Reset redirecting state when pathname changes or auth state changes
  useEffect(() => {
    setIsRedirecting(false);
  }, [pathname, isAuthenticated]);

  // Show loading spinner while checking authentication or redirecting
  if (isLoading || isRedirecting) {
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