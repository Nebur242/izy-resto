import { AppRoutes } from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ApiProvider } from './context/ApiContext';
import { useSEO } from './hooks/useSEO';

export default function App() {
  // Add SEO hook to update title and favicon
  useSEO();

  return (
    <ThemeProvider>
      <AuthProvider>
        <ApiProvider>
          <CartProvider>
            <OrderProvider>
              <AppRoutes />
            </OrderProvider>
          </CartProvider>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}