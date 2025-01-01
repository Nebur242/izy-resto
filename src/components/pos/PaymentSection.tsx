import React from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency, getCurrencyStep, getQuickAmounts } from '../../utils/currency';

interface PaymentSectionProps {
  total: number;
  amountPaid: number;
  onAmountPaidChange: (amount: number) => void;
  onQuickAmount: (amount: number) => void;
}

export function PaymentSection({ 
  total, 
  amountPaid, 
  onAmountPaidChange,
  onQuickAmount 
}: PaymentSectionProps) {
  const { settings } = useSettings();
  const change = amountPaid - total;
  const quickAmounts = getQuickAmounts(settings?.currency);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium">Détails du Paiement</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Montant Reçu</label>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => onAmountPaidChange(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border dark:border-gray-700 p-2"
            min={0}
            step={getCurrencyStep(settings?.currency)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Monnaie</label>
          <div className={`w-full rounded-lg p-2 font-mono text-lg ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(Math.abs(change), settings?.currency)}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-wrap gap-2">
        {quickAmounts.map(amount => (
          <motion.button
            key={amount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickAmount(amount)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {formatCurrency(amount, settings?.currency)}
          </motion.button>
        ))}
      </div> */}
    </div>
  );
}