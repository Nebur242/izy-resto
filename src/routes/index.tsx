import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import OrderTracking from '../pages/OrderTracking'; // Updated import
import { OrderReceipt } from '../pages/OrderReceipt';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { AuthGuard } from '../components/auth/AuthGuard';
import PaymentFailure from '../pages/paytech/FailedPage';
import PaymentSuccess from '../pages/paytech/SuccessPage';
import { TermsOfService } from '../pages/TermsOfService';
import { Home } from '../pages/home';

// Lazy load the Dashboard component
const Dashboard = React.lazy(() =>
  import('../pages/dashboard/Dashboard')
    .then(module => ({ default: module.default }))
    .catch(error => {
      console.error('Error loading Dashboard:', error);
      return { default: () => <Navigate to="/login" replace /> };
    })
);

export function AppRoutes() {
  // const { settings } = useSettings();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/order/:orderId" element={<OrderTracking />} />
      <Route path="/receipt" element={<OrderReceipt />} />
      <Route path="/paytech/success" element={<PaymentSuccess />} />
      <Route path="/paytech/failed" element={<PaymentFailure />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <AuthGuard requireAuth={false}>
            <LoginPage />
          </AuthGuard>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard/*"
        element={
          <AuthGuard>
            <Suspense fallback={<LoadingScreen isLoading={true} />}>
              <Dashboard />
            </Suspense>
          </AuthGuard>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
