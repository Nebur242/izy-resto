import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ShoppingBag } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import { formatCurrency } from '../../../utils/currency';
import { CustomerStats } from '../../../types/customer';
import { Button } from '../../ui/Button';

interface CustomerListProps {
  customers: CustomerStats[];
  onViewDetails: (customerId: string) => void;
}

export function CustomerList({ customers, onViewDetails }: CustomerListProps) {
  const { settings } = useSettings();

  return (
    <div className="grid gap-4">
      {customers.map((customer) => (
        <motion.div
          key={customer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">{customer.name}</h3>
              <div className="space-y-1">
                {customer.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {customer.email}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {customer.phone}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end gap-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {customer.orderCount} commande{customer.orderCount > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {formatCurrency(customer.totalSpent, settings?.currency)}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onViewDetails(customer.id)}
              >
                Voir détails
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}