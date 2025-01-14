import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingScreen } from '../ui/LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Only store redirect URL if not authenticated and auth is required
    if (!loading && requireAuth && !isAuthenticated) {
      sessionStorage.setItem('redirectUrl', location.pathname);
    }
  }, [loading, requireAuth, isAuthenticated, location.pathname]);

  if (user?.isAnonymous && window.location.pathname.includes('login')) {
    return <>{children}</>;
  }

  // Show loading screen while checking auth state
  if (loading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Get redirect URL from session storage or default to dashboard
    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
    sessionStorage.removeItem('redirectUrl'); // Clean up
    return <Navigate to={redirectUrl} replace />;
  }

  return <>{children}</>;
}
