import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPageWrapper } from '../../../components/dashboard/DashboardPageWrapper';
import { Overview } from '../pages/Overview';
import { CategoryManagement } from '../pages/CategoryManagement';
import { MenuManagement } from '../pages/MenuManagement';
import { OrderManagement } from '../pages/OrderManagement';
import { CustomerManagement } from '../pages/CustomerManagement';
import { Settings } from '../pages/Settings';
import { POS } from '../pages/POS';
import { QRCodeManagement } from '../pages/QRCodeManagement';
import { InventoryManagement } from '../pages/InventoryManagement';
import { AccountingManagement } from '../pages/AccountingManagement';
import { VariantManagement } from '../pages/VariantManagement';
import { MediaLibrary } from '../pages/MediaLibrary';
import { StaffManagement } from '../pages/StaffManagement';
import { PaymentManagement } from '../pages/PaymentManagement';
import { TrafficAnalytics } from '../pages/TrafficAnalytics';
import { ProtectedRoute } from './ProtectedRoute';
import { StaffMember } from '../../../types/staff';

interface DashboardRoutesProps {
  isStaff: boolean;
  staffData: StaffMember | null;
}

export function DashboardRoutes({ isStaff, staffData }: DashboardRoutesProps) {
  const wrapComponent = (Component: React.ComponentType<any>) => (
    <DashboardPageWrapper>
      <Component />
    </DashboardPageWrapper>
  );

  return (
    <Routes>
      {/* Core Operations */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute
            route=""
            element={wrapComponent(Overview)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />
      
      <Route path="/orders" element={wrapComponent(OrderManagement)} />
      <Route path="/pos" element={wrapComponent(POS)} />

      {/* Analytics */}
      <Route 
        path="/traffic" 
        element={
          <ProtectedRoute
            route="traffic"
            element={wrapComponent(TrafficAnalytics)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />

      {/* Menu Management */}
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute
            route="menu"
            element={wrapComponent(MenuManagement)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />
      
      <Route 
        path="/categories" 
        element={
          <ProtectedRoute
            route="categories"
            element={wrapComponent(CategoryManagement)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />
      
      <Route 
        path="/variants" 
        element={
          <ProtectedRoute
            route="variants"
            element={wrapComponent(VariantManagement)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />

      {/* Stock & Finance */}
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute
            route="inventory"
            element={wrapComponent(InventoryManagement)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />
      
      <Route 
        path="/accounting" 
        element={
          <ProtectedRoute
            route="accounting"
            element={wrapComponent(AccountingManagement)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />
      
      <Route 
        path="/payments" 
        element={
          <ProtectedRoute
            route="payments"
            element={wrapComponent(PaymentManagement)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />

      {/* Customer Experience */}
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute
            route="customers"
            element={wrapComponent(CustomerManagement)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />
      
      <Route path="/qr-code" element={wrapComponent(QRCodeManagement)} />

      {/* Administration */}
      <Route 
        path="/staff" 
        element={
          <ProtectedRoute
            route="staff"
            element={wrapComponent(StaffManagement)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />
      
      <Route 
        path="/media" 
        element={
          <ProtectedRoute
            route="media"
            element={wrapComponent(MediaLibrary)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute
            route="settings"
            element={wrapComponent(Settings)}
            isStaff={isStaff}
            staffData={staffData}
          />
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}