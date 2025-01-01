import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStaffPermissions } from '../../../hooks/useStaffPermissions';
import { PUBLIC_ROUTES } from '../../../constants/routes';
import type { DashboardRoute } from '../../../constants/routes';

interface ProtectedRouteProps {
  element: React.ReactElement;
  route: DashboardRoute;
  isStaff: boolean;
}

export function ProtectedRoute({ element, route, isStaff }: ProtectedRouteProps) {
  const { allowedRoutes } = useStaffPermissions();

  // Admin has access to all routes
  if (!isStaff) return element;

  // Staff can access public routes
  if (PUBLIC_ROUTES.includes(route as any)) return element;

  // Check if route is in allowed staff routes
  if (allowedRoutes.includes(route)) return element;

  // Redirect to POS if not authorized
  return <Navigate to="/dashboard/pos" replace />;
}