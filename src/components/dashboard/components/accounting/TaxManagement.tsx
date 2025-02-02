import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';
import { motion } from 'framer-motion';

interface TaxRecord {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  reference: string;
}

export function TaxManagement() {
  const { settings } = useSettings();
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);

  const totalPending = taxRecords
    .filter(tax => tax.status === 'pending')
    .reduce((sum, tax) => sum + tax.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Gestion des Taxes</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Taxes en attente: {formatCurrency(totalPending, settings?.currency)}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une Taxe
        </Button>
      </div>

      <div className="grid gap-4">
        {taxRecords.map(tax => (
          <motion.div
            key={tax.id}
            layout
            className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm ${
              tax.status === 'pending' && new Date(tax.dueDate) < new Date()
                ? 'border-l-4 border-red-500'
                : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{tax.type}</h3>
                  {tax.status === 'pending' &&
                    new Date(tax.dueDate) < new Date() && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Échéance: {new Date(tax.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatCurrency(tax.amount, settings?.currency)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Réf: {tax.reference}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
