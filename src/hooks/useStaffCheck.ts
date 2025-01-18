import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { staffService } from '../services/staff/staff.service';
import { StaffMember } from '../types/staff';

export function useStaffCheck() {
  const { user } = useAuth();
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [staffData, setStaffData] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkStaffStatus() {
      if (!user?.email) {
        setIsStaff(false);
        setStaffData(null);
        setIsLoading(false);
        return;
      }

      try {
        const member = await staffService.getStaffByEmail(user.email);
        setIsStaff(!!member);
        setStaffData(member);
      } catch (error) {
        console.error('Error checking staff status:', error);
        setIsStaff(false);
        setStaffData(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkStaffStatus();
  }, [user?.email]);

  return { isStaff, staffData, isLoading };
}
