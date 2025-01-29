import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../hooks';
import { usePageLoading } from '../../hooks/usePageLoading';
import { useStaffCheck } from '../../hooks/useStaffCheck';
import { DashboardLayout } from './DashboardLayout';
import { DashboardRoutes } from './routes/DashboardRoutes';

export default function Dashboard() {
  const { logout } = useAuth();
  const { isStaff, staffData, isLoading: staffLoading } = useStaffCheck();
  const { isLoading, settings } = useSettings();

  const { isLoading: pageLoading } = usePageLoading();

  if (pageLoading || staffLoading || isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    <>
      <DashboardLayout
        onLogout={logout}
        settings={settings}
        isStaff={isStaff}
        staffData={staffData}
      >
        <DashboardRoutes
          isStaff={isStaff}
          staffData={staffData}
          settings={settings}
        />
      </DashboardLayout>
    </>
  );
}
