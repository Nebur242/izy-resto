import { Transaction } from '../../../../types/accounting';
import { formatCurrency } from '../../../../utils/currency';
import { formatDate } from '../../../../utils/date';
import { Building, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { RestaurantSettings } from '../../../../types';

interface FinancialStatementProps {
  transactions: Transaction[];
  period: { startDate: Date; endDate: Date };
  settings: RestaurantSettings;
}

export function FinancialStatement({
  transactions,
  period,
  settings,
}: FinancialStatementProps) {
  const totals = transactions.reduce(
    (acc, t) => ({
      debit: acc.debit + (t.debit || 0),
      credit: acc.credit + (t.credit || 0),
      net: acc.net + ((t.credit || 0) - (t.debit || 0)),
    }),
    { debit: 0, credit: 0, net: 0 }
  );

  const currency = settings?.currency || 'XOF';

  return (
    <div className="p-12 bg-white text-black font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-blue-800">
              {settings?.name || 'Restaurant'}
            </h1>
            <h2 className="text-xl font-semibold text-black">
              États Financiers
            </h2>
          </div>
          <div className="text-right">
            <Building className="w-12 h-12 text-black mx-auto mb-2" />
            <p className="text-sm text-black">
              Période: {formatDate(period.startDate.toISOString())} -{' '}
              {formatDate(period.endDate.toISOString())}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="bg-blue-50">
            <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-black">
              Date
            </th>
            <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-black">
              Source
            </th>
            <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-black">
              Description
            </th>
            <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold text-black">
              Référence
            </th>
            <th className="text-right px-3 py-2 border-b border-gray-200 font-semibold text-black">
              Débit
            </th>
            <th className="text-right px-3 py-2 border-b border-gray-200 font-semibold text-black">
              Crédit
            </th>
            <th className="text-right px-3 py-2 border-b border-gray-200 font-semibold text-black">
              Solde
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr
              key={transaction.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-3 py-2 border-b border-gray-100 text-black">
                {formatDate(transaction.date)}
              </td>
              <td className="px-3 py-2 border-b border-gray-100 text-black">
                {transaction.source}
              </td>
              <td className="px-3 py-2 border-b border-gray-100 text-black">
                {transaction.description}
              </td>
              <td className="px-3 py-2 border-b border-gray-100 text-black">
                {transaction.reference}
              </td>
              <td className="text-right px-3 py-2 border-b border-gray-100 text-black font-semibold	">
                {transaction.debit > 0 &&
                  formatCurrency(transaction.debit, currency)}
              </td>
              <td className="text-right px-3 py-2 border-b border-gray-100 text-black font-semibold">
                {transaction.credit > 0 &&
                  formatCurrency(transaction.credit, currency)}
              </td>
              <td className="text-right px-3 py-2 border-b border-gray-100 text-black font-bold">
                {formatCurrency(transaction.gross, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-3">
            <TrendingDown className="w-6 h-6 text-red-500 mr-3" />
            <p className="text-sm font-medium text-black">Total Débit</p>
          </div>
          <p className="text-2xl font-bold text-black">
            {formatCurrency(totals.debit, currency)}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
            <p className="text-sm font-medium text-black">Total Crédit</p>
          </div>
          <p className="text-2xl font-bold text-black">
            {formatCurrency(totals.credit, currency)}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-3">
            <FileText className="w-6 h-6 text-blue-500 mr-3" />
            <p className="text-sm font-medium text-black">Solde Net</p>
          </div>
          <p
            className={`text-2xl font-bold ${
              totals.net >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(totals.net, currency)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 pt-6 text-center">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-sm font-medium text-black">
              {settings?.name || 'Restaurant'}
            </p>
            <p className="text-xs text-black">
              {settings?.address || 'Adresse non disponible'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-black">
              Document généré le {new Date().toLocaleDateString()}
            </p>
            <p className="text-xs text-black">
              Tous droits réservés © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
