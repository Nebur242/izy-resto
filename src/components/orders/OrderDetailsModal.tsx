import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, Truck, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useSettings } from '../../hooks/useSettings';
import { useOrders } from '../../context/OrderContext';
import { formatCurrency } from '../../utils/currency';
import { formatFirestoreTimestamp } from '../../utils/date';
import { OrderTimeline } from './OrderTimeline';
import { Button } from '../ui/Button';
import { OrderQRCode } from './OrderQRCode';

interface OrderDetailsModalProps {
  orderId: string | null;
  onClose: () => void;
}

export function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { getOrderById } = useOrders();
  
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {t('orders.orderNumber')} {order.id.slice(0, 8)}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {formatFirestoreTimestamp(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(order.total, settings?.currency)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.items.length} {t('orders.items')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Type & Payment Method */}
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
              {order.diningOption === 'dine-in' ? (
                <>
                  <Utensils className="w-4 h-4 mr-2" />
                  Sur Place (Table {order.tableNumber})
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 mr-2" />
                  Livraison
                </>
              )}
            </div>
            {order.paymentMethod && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                <CreditCard className="w-4 h-4 mr-2" />
                {order.paymentMethod.name}
              </div>
            )}
          </div>

          {/* Order Timeline */}
          <OrderTimeline
            status={order.status}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Détails Client</h3>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  {order.customerPhone}
                </p>
                {order.customerEmail && (
                  <p className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    {order.customerEmail}
                  </p>
                )}
                {order.diningOption === 'delivery' && order.customerAddress && (
                  <p className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {order.customerAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Articles</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.price, settings?.currency)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity, settings?.currency)}
                    </p>
                  </div>
                ))}
                <div className="border-t dark:border-gray-600 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total, settings?.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="border-t dark:border-gray-700 pt-6">
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold">Suivi de commande</h3>
              <OrderQRCode orderId={order.id} size={150} />
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 p-6">
          <Button onClick={onClose} className="w-full">
            Fermer
          </Button>
        </div>
      </motion.div>
    </div>
  );
}