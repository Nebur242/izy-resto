import { AppRoutes } from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ApiProvider } from './context/ApiContext';
import { useSEO } from './hooks/useSEO';
import { useEffect } from 'react';
import { anonymousAuthService } from './services/auth/anonymousAuth.service';
import { RestaurantClosedModal } from './components/ui/RestaurantClosedModal';
import { CookieBanner } from './components/ui/CookieBanner';

export default function App() {
  // Add SEO hook to update title and favicon
  useSEO();

  // Initialize anonymous auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!anonymousAuthService.getCurrentUser()) {
          await anonymousAuthService.signInAnonymously();
        }
      } catch (error) {
        console.error('Error initializing anonymous auth:', error);
      }
    };

    initializeAuth();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiProvider>
          <CartProvider>
            <OrderProvider>
              <AppRoutes />
              <RestaurantClosedModal />
              <CookieBanner />
            </OrderProvider>
          </CartProvider>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
