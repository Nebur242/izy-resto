import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/auth/auth.service';
import { staffService } from '../services/staff/staff.service';
import { StaffMember } from '../types/staff';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [staffData, setStaffData] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const staff = await staffService.getStaffByEmail(user.email!);
          setStaffData(staff);
        } catch (error) {
          console.error('Error fetching staff data:', error);
          setStaffData(null);
        }
      } else {
        setStaffData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return { 
    user, 
    staffData, 
    loading,
    isAuthenticated: !!user 
  };
}