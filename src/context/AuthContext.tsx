import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth/auth.service';
import { staffService } from '../services/staff/staff.service';
import { StaffMember } from '../types/staff';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  staffData: StaffMember | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [staffData, setStaffData] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged(async user => {
      if (user && user.isAnonymous) {
        if (window.location.pathname.startsWith('/dashboard')) {
          navigate('/', { replace: true });
        }
        return setLoading(false);
      }

      setUser(user);
      setIsAuthenticated(!!user);

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
        // Redirect to home if logged out
        if (window.location.pathname.startsWith('/dashboard')) {
          navigate('/', { replace: true });
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);

      // Get redirect URL from session storage or default to dashboard
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
      sessionStorage.removeItem('redirectUrl');

      navigate(redirectUrl, { replace: true });
      toast.success('Connexion réussie');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Échec de la connexion');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();

      // Clear all session/local storage data
      sessionStorage.clear();
      localStorage.clear();

      // Reset states
      setUser(null);
      setStaffData(null);
      setIsAuthenticated(false);

      // Redirect to landing page
      navigate('/', { replace: true });
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Échec de la déconnexion');
    }
  };

  const value = {
    user,
    staffData,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
