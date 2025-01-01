import React from 'react';
import { Truck, Utensils, CreditCard } from 'lucide-react';
import { Order } from '../../../types';
import { useSettings } from '../../../hooks/useSettings';
import { formatCurrency } from '../../../utils/currency';
import { formatFirestoreTimestamp } from '../../../utils/date';

interface OrderReceiptDetailsProps {
  order: Order;
}

export function OrderReceiptDetails({ order }: OrderReceiptDetailsProps) {
  const { settings } = useSettings();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 sm:p-8">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Commande #{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {formatFirestoreTimestamp(order.createdAt)}
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(order.total, settings?.currency)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {order.items.length} articles
          </p>
        </div>
      </div>

      {/* Order Type & Payment */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full">
          {order.diningOption === 'dine-in' ? (
            <>
              <Utensils className="h-5 w-5" />
              <span>Sur place (Table {order.tableNumber})</span>
            </>
          ) : (
            <>
              <Truck className="h-5 w-5" />
              <span>Livraison</span>
            </>
          )}
        </div>
        {order.paymentMethod && (
          <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full">
            <CreditCard className="h-5 w-5" />
            <span>{order.paymentMethod.name}</span>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner mb-8">
        <div className="px-4 sm:px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Articles commandés
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {order.items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatCurrency(item.price, settings?.currency)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {formatCurrency(item.price * item.quantity, settings?.currency)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">Total</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {formatCurrency(order.total, settings?.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="px-4 sm:px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Informations client
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-200">{order.customerName}</p>
            <p className="text-gray-700 dark:text-gray-200">{order.customerPhone}</p>
            {order.customerEmail && (
              <p className="text-gray-700 dark:text-gray-200">{order.customerEmail}</p>
            )}
            {order.diningOption === 'delivery' && (
              <p className="text-gray-700 dark:text-gray-200 font-medium mt-4">
                Adresse de livraison: {order.customerAddress}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}