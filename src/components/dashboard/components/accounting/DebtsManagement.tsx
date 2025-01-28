import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { useSettings } from '../../../../hooks/useSettings';
import { formatCurrency } from '../../../../utils/currency';
import { motion } from 'framer-motion';

interface Debt {
  id: string;
  creditor: string;
  amount: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
  description: string;
  status: 'active' | 'paid';
}

export function DebtsManagement() {
  const { settings } = useSettings();
  const [debts, setDebts] = useState<Debt[]>([]);

  const calculateTotalWithInterest = (debt: Debt) => {
    const months = (new Date(debt.dueDate).getTime() - new Date(debt.startDate).getTime()) / (30 * 24 * 60 * 60 * 1000);
    const interest = debt.amount * (debt.interestRate / 100) * (months / 12);
    return debt.amount + interest;
  };

  const totalDebts = debts.reduce((sum, debt) => 
    debt.status === 'active' ? sum + calculateTotalWithInterest(debt) : sum, 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Dettes et Emprunts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total des dettes: {formatCurrency(totalDebts, settings?.currency)}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une Dette
        </Button>
      </div>

      <div className="grid gap-4">
        {debts.map((debt) => (
          <motion.div
            key={debt.id}
            layout
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{debt.creditor}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Échéance: {new Date(debt.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatCurrency(calculateTotalWithInterest(debt), settings?.currency)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Taux: {debt.interestRate}%
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}