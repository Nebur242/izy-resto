import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingScreen } from '../ui/LoadingScreen';
import { authService } from '../../services/auth/auth.service';

export function RouteHandler({ children }: { children: React.ReactNode }) {
  const { loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check auth state on route changes
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const path = location.pathname;

      // Handle dashboard routes
      if (path.startsWith('/dashboard')) {
        if (!currentUser) {
          sessionStorage.setItem('redirectUrl', path);
          navigate('/login', { replace: true });
          return;
        }
      }

      // Handle login route
      if (path === '/login' && currentUser) {
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
        sessionStorage.removeItem('redirectUrl');
        navigate(redirectUrl, { replace: true });
      }
    };

    if (!authLoading) {
      checkAuth();
    }
  }, [location.pathname, navigate, authLoading]);

  // Show loading screen during initial auth check
  if (authLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return <>{children}</>;
}