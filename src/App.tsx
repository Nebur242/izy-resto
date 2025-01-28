import { Toast } from './components/ui';
import { CookieBanner } from './components/ui/CookieBanner';
import { HolidayClosureModal } from './components/ui/HolidayClosureModal';
import { RestaurantClosedModal } from './components/ui/RestaurantClosedModal';
import { ApiProvider } from './context/ApiContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ServerCartProvider } from './context/ServerCartContext';
import { ThemeProvider } from './context/ThemeContext';
import { useSEO } from './hooks/useSEO';
import { AppRoutes } from './routes';

export default function App() {
  // Add SEO hook to update title and favicon
  useSEO();

  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiProvider>
          <CartProvider>
            <ServerCartProvider>
              <OrderProvider>
                <div className="text-gray-500 dark:text-gray-400">
                  <AppRoutes />
                </div>
                <RestaurantClosedModal />
                <HolidayClosureModal />
                <CookieBanner />
                <Toast />
              </OrderProvider>
            </ServerCartProvider>
          </CartProvider>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
