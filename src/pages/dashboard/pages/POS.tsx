import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '../../../hooks/useMenu';
import { useCategories } from '../../../hooks/useCategories';
import { MenuItem, CartItem, Order } from '../../../types';
import { orderService } from '../../../services/orders/order.service';
import { useSettings } from '../../../hooks/useSettings';
import { MenuFilters } from '../../../components/menu/MenuFilters';
import { POSMenuGrid } from '../../../components/dashboard/components/pos/POSMenuGrid';
import { POSCartSidebar } from '../../../components/dashboard/components/pos/POSCartSidebar';
import { OrderConfirmationModal } from '../../../components/pos/OrderConfirmationModal';
import toast from 'react-hot-toast';

export function POS() {
  const { items } = useMenu();
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: MenuItem & { quantity?: number }) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + (item.quantity || 1);
        
        if (item.stockQuantity && newQuantity > item.stockQuantity) {
          toast.error(`Stock insuffisant. Maximum disponible: ${item.stockQuantity}`);
          return currentCart;
        }

        const updatedCart = currentCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
        return updatedCart;
      }
      
      if (item.stockQuantity && (item.quantity || 1) > item.stockQuantity) {
        return currentCart;
      }

      const newItem = { ...item, quantity: item.quantity || 1 };
      return [...currentCart, newItem];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(currentCart => {
      const item = currentCart.find(i => i.id === itemId);
      
      if (!item) return currentCart;

      const newQuantity = item.quantity + delta;

      if (item.stockQuantity && newQuantity > item.stockQuantity) {
        return currentCart;
      }

      if (newQuantity < 1) {
        return currentCart.filter(item => item.id !== itemId);
      }

      return currentCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== itemId));
  };

  const handleQuickAmount = (amount: number) => {
    setAmountPaid(amount);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      const orderData = {
        items: cart,
        status: 'pending',
        total,
        customerName: customerInfo.name || `Table ${tableNumber}`,
        customerEmail: customerInfo.email || null,
        customerPhone: customerInfo.phone || '',
        diningOption: 'dine-in',
        tableNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const orderId = await orderService.createOrder(orderData);
      const createdOrder = await orderService.getOrderById(orderId);
      
      if (createdOrder) {
        setCompletedOrder(createdOrder);
        setCart([]);
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
      <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
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
                onRemoveItem={removeFromCart}
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
            onRemoveItem={removeFromCart}
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