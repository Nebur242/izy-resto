import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CartItem } from '../../../../types';
import { CartItemList } from '../../../pos/CartItemList';
import { CustomerInfoForm } from '../../../pos/CustomerInfoForm';
import { OrderSummary } from '../../../pos/OrderSummary';
import { PaymentSection } from '../../../pos/PaymentSection';
import { Button } from '../../../ui/Button';
import { createPosOrder } from '../../../../services/orders/createOrder';
import toast from 'react-hot-toast';

interface POSCartSidebarProps {
  onClose?: () => void;
  cart: CartItem[];
  tableNumber: string;
  setTableNumber: (value: string) => void;
  customerInfo: {
    name?: string;
    phone?: string;
  };
  setCustomerInfo: (info: { name?: string; phone?: string }) => void;
  amountPaid: number;
  setAmountPaid: (amount: number) => void;
  total: number;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onQuickAmount: (amount: number) => void;
  onCheckout: () => Promise<void>;
  isSubmitting: boolean;
}

export function POSCartSidebar({
  onClose,
  cart,
  tableNumber,
  setTableNumber,
  customerInfo,
  setCustomerInfo,
  amountPaid,
  setAmountPaid,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onQuickAmount,
  onCheckout,
  isSubmitting,
}: POSCartSidebarProps) {
  const handleCheckout = async () => {
    try {
      await onCheckout();
      toast.success('Commande créée avec succès');
    } catch (error) {
      console.error('Error creating order:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Échec de la création de la commande');
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      {onClose && (
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Panier</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Table Number */}
        <div className="p-4 border-b dark:border-gray-700">
          <label className="block text-sm font-medium mb-1">
            Numéro de Table (Optionnel)
          </label>
          <input
            type="text"
            value={tableNumber}
            onChange={e => setTableNumber(e.target.value)}
            className="w-full rounded-lg border dark:border-gray-700 p-2"
            placeholder="Ex: 42"
          />
        </div>

        {/* Customer Info */}
        <div className="p-4 border-b dark:border-gray-700">
          <CustomerInfoForm
            customerInfo={customerInfo}
            onChange={setCustomerInfo}
          />
        </div>

        {/* Cart Items */}
        <div className="px-4">
          <CartItemList
            items={cart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="border-t dark:border-gray-700 p-4 space-y-4 bg-white dark:bg-gray-800">
        <OrderSummary items={cart} total={total} />

        <PaymentSection
          total={total}
          amountPaid={amountPaid}
          onAmountPaidChange={setAmountPaid}
          onQuickAmount={onQuickAmount}
        />

        <Button
          onClick={handleCheckout}
          disabled={cart.length === 0 || isSubmitting}
          className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                     transition-colors duration-200 shadow-sm hover:shadow-md
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Traitement...' : 'Valider la commande'}
        </Button>
      </div>
    </div>
  );
}
