import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { POSCartSidebar } from '../../../components/dashboard/components/pos/POSCartSidebar';
import { POSMenuGrid } from '../../../components/dashboard/components/pos/POSMenuGrid';
import { MenuFilters } from '../../../components/menu/MenuFilters';
import { OrderConfirmationModal } from '../../../components/pos/OrderConfirmationModal';
import { useServerCart } from '../../../context/ServerCartContext';
import { useMenu } from '../../../hooks/useMenu';
import { useSettings } from '../../../hooks/useSettings';
import { useStaffCheck } from '../../../hooks/useStaffCheck';
import { orderService } from '../../../services/orders/order.service';
import { Order } from '../../../types';

export function POS() {
  const { items } = useMenu();
  const { settings } = useSettings();
  const { staffData } = useStaffCheck();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [amountPaid, setAmountPaid] = useState(0);
  const [customerInfo, setCustomerInfo] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const {
    total,
    addToCart,
    updateQuantity,
    cart,
    clearCart,
    taxTotal,
    taxes,
    tip,
    subtotal,
  } = useServerCart();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // const removeFromCart = (itemId: string) => {
  //   setCart(currentCart => currentCart.filter(item => item.id !== itemId));
  // };

  const handleQuickAmount = (amount: number) => {
    setAmountPaid(amount);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      const orderData: Omit<Order, 'id'> = {
        items: cart,
        status: 'pending',
        total,
        customerName: customerInfo.name || `Table ${tableNumber}`,
        customerEmail: customerInfo.email || null,
        customerPhone: customerInfo.phone || '',
        diningOption: 'dine-in',
        tableNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: {
          name: 'Paiement à la caisse',
          id: 'Paiement à la caisse',
          active: true,
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString(),
        },
        subtotal,
        taxes,
        taxTotal,
        amountPaid,
        change: amountPaid - total,
        tip,
        servedBy: staffData?.name || 'Le gérant',
      };

      const orderId = await orderService.createOrder({
        ...orderData,
        taxRates: settings?.taxes.rates || [],
      });
      const createdOrder = await orderService.getOrderById(orderId);

      if (createdOrder) {
        setCompletedOrder(createdOrder);
        clearCart();
        setTableNumber('');
        setAmountPaid(0);
        setCustomerInfo({});
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Menu Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <MenuFilters
            activeCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <POSMenuGrid
            items={filteredItems}
            onAddToCart={addToCart}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onToggleCart={() => setIsSidebarOpen(true)}
          />
        </div>

        {/* Mobile Cart */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden"
            >
              <POSCartSidebar
                onClose={() => setIsSidebarOpen(false)}
                cart={cart}
                tableNumber={tableNumber}
                setTableNumber={setTableNumber}
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                amountPaid={amountPaid}
                setAmountPaid={setAmountPaid}
                total={total}
                onUpdateQuantity={updateQuantity}
                // onRemoveItem={removeFromCart}
                onQuickAmount={handleQuickAmount}
                onCheckout={handleCheckout}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Cart */}
        <div className="hidden lg:block w-96 bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col">
          <POSCartSidebar
            cart={cart}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            total={total}
            onUpdateQuantity={updateQuantity}
            // onRemoveItem={removeFromCart}
            onQuickAmount={handleQuickAmount}
            onCheckout={handleCheckout}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {completedOrder && (
        <OrderConfirmationModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}
    </>
  );
}
