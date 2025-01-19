import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { Toast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { usePageLoading } from '../../hooks/usePageLoading';
import { useStaffCheck } from '../../hooks/useStaffCheck';
import { DashboardLayout } from './DashboardLayout';
import { DashboardRoutes } from './routes/DashboardRoutes';

export default function Dashboard() {
  const { logout } = useAuth();
  const { isStaff, staffData, isLoading: staffLoading } = useStaffCheck();

  const { isLoading: pageLoading } = usePageLoading();

  if (pageLoading || staffLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    <>
      <DashboardLayout onLogout={logout}>
        <DashboardRoutes isStaff={isStaff} staffData={staffData} />
      </DashboardLayout>
      <Toast />
    </>
  );
}
