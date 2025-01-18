import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { app } from '../../lib/firebase/config';

const auth = getAuth(app);

// Use session persistence instead of local
setPersistence(auth, browserSessionPersistence).catch(error => {
  console.error('Auth persistence error:', error);
});

class AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error.code);
      const customError = new Error(errorMessage);
      customError.name = 'AuthError';
      throw customError;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);

      const hasAcceptedCookies = localStorage.getItem('cookiesAccepted')
        ? localStorage.getItem('cookiesAccepted') === 'true'
        : false;

      // Clear any auth-related data from storage
      sessionStorage.clear();
      localStorage.clear();

      if (hasAcceptedCookies) {
        localStorage.setItem('cookiesAccepted', `${hasAcceptedCookies}`);
      }
    } catch (error: any) {
      const customError = new Error('Failed to log out');
      customError.name = 'AuthError';
      throw customError;
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'Adresse email invalide';
      case 'auth/user-disabled':
        return 'Ce compte a été désactivé';
      case 'auth/user-not-found':
        return 'Aucun compte trouvé avec cet email';
      case 'auth/wrong-password':
        return 'Mot de passe incorrect';
      case 'auth/too-many-requests':
        return 'Trop de tentatives de connexion. Veuillez réessayer plus tard.';
      case 'auth/network-request-failed':
        return 'Erreur de connexion. Vérifiez votre connexion internet.';
      default:
        return 'Échec de la connexion';
    }
  }
}

export const authService = new AuthService();
