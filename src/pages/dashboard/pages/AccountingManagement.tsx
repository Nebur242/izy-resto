import { useState, useRef } from 'react';
import { Tabs } from '../../../components/ui/Tabs';
import { AccountingOverview } from '../../../components/dashboard/components/accounting/AccountingOverview';
import {
  sourceText,
  TransactionList,
} from '../../../components/dashboard/components/accounting/TransactionList';
import { DateFilter } from '../../../components/dashboard/components/accounting/DateFilter';
import { AssetsManagement } from '../../../components/dashboard/components/accounting/AssetsManagement';
import { DebtsManagement } from '../../../components/dashboard/components/accounting/DebtsManagement';
import { Button } from '../../../components/ui/Button';
import { Plus, Download } from 'lucide-react';
import { useAccounting } from '../../../hooks/useAccounting';
import { TransactionForm } from '../../../components/dashboard/components/accounting/TransactionForm';
import { FinancialStatement } from '../../../components/dashboard/components/accounting/FinancialStatement';
import { accountingService } from '../../../services/accounting/accounting.service';
import { exportToPng } from '../../../utils/export';
import toast from 'react-hot-toast';
import { useSettings } from '../../../hooks';
import { AccountingTaxesManagement } from './AccountingTaxesManagement';
import { AccountingTipsManagement } from './AccountingTipsManagement';
import { formatDate } from '../../../utils';
import { Transaction } from '../../../types';
import { formatCurrency } from '../../../utils/currency';

const tabs = [
  { id: 'transactions', label: 'Transactions' },
  { id: 'tax', label: 'Taxes' },
  { id: 'tips', label: 'Pourboires' },
];

export function AccountingManagement() {
  const { settings, isLoading: settingsLoading } = useSettings();

  const [activeTab, setActiveTab] = useState('transactions');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(0)), // First day of current month
    endDate: new Date(),
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const statementRef = useRef<HTMLDivElement>(null);

  const { transactions, stats, isLoading, refreshData } =
    useAccounting(dateRange);

  const handleDateChange = (start: Date, end: Date) => {
    setDateRange({ startDate: start, endDate: end });
  };

  const handleSaveTransaction = async (data: any) => {
    try {
      await accountingService.createTransaction(data);
      setIsFormOpen(false);
      refreshData();
      toast.success('Transaction ajoutée avec succès');
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Erreur lors de la sauvegarde de la transaction');
    }
  };

  const handleUpdateTransaction = async (id: string, data: any) => {
    try {
      await accountingService.updateTransaction(id, data);
      refreshData();
      toast.success('Transaction mise à jour avec succès');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Erreur lors de la mise à jour de la transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await accountingService.deleteTransaction(id);
      refreshData();
      toast.success('Transaction supprimée avec succès');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Erreur lors de la suppression de la transaction');
    }
  };

  function exportFinancialStatementToCSV(
    transactions: Transaction[],
    period: { startDate: Date; endDate: Date },
    settings: any
  ) {
    try {
      // Calculate totals
      const totals = transactions.reduce(
        (acc, t) => ({
          debit: acc.debit + (t.debit || 0),
          credit: acc.credit + (t.credit || 0),
          net: acc.net + ((t.credit || 0) - (t.debit || 0)),
        }),
        { debit: 0, credit: 0, net: 0 }
      );

      const currency = settings?.currency || 'XOF';

      // Create CSV content
      let csvContent = '';

      // Add header info
      csvContent += `${settings?.name || 'Restaurant'}\n`;
      csvContent += 'États Financiers\n';
      csvContent += `Période: ${formatDate(period.startDate)} - ${formatDate(
        period.endDate
      )}\n\n`;

      // Add summary section
      csvContent += 'Résumé\n';
      csvContent += `Total Débit,${formatCurrency(
        totals.debit,
        currency
      ).replace(',', ' ')}\n`;
      csvContent += `Total Crédit,${formatCurrency(
        totals.credit,
        currency
      ).replace(',', ' ')}\n`;
      csvContent += `Solde Net,${formatCurrency(totals.net, currency).replace(
        ',',
        ' '
      )}\n\n`;

      // Add transactions
      csvContent += 'Détail des transactions\n';
      csvContent += 'Date,Source,Description,Référence,Débit,Crédit,Solde\n';

      transactions.forEach(transaction => {
        csvContent +=
          [
            formatDate(transaction.date),
            sourceText[transaction.source],
            transaction.description?.replace(/,/g, ';'), // Replace commas with semicolons to avoid CSV issues
            transaction.reference,
            transaction.debit > 0
              ? formatCurrency(transaction.debit, currency).replace(',', ' ')
              : '',
            transaction.credit > 0
              ? formatCurrency(transaction.credit, currency).replace(',', ' ')
              : '',
            formatCurrency(transaction.gross, currency).replace(',', ' '),
          ].join(',') + '\n';
      });

      // Add footer
      csvContent += '\n';
      csvContent += `Document généré le ${new Date().toLocaleDateString()}\n`;
      if (settings?.address) {
        csvContent += `${settings.address}\n`;
      }

      // Create and trigger download
      const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `etats-financiers-${formatDate(period.startDate)}-${formatDate(
          period.endDate
        )}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating financial statement CSV:', error);
      throw new Error('Failed to generate financial statement CSV');
    }
  }

  // Update the handleExport function
  const handleExport = async () => {
    try {
      // Fetch latest transactions
      const fetchedTransactions = await accountingService.getTransactions(
        dateRange
      );

      // Generate and download CSV
      exportFinancialStatementToCSV(fetchedTransactions, dateRange, settings);

      toast.success('États financiers exportés avec succès');
    } catch (error) {
      console.error('Error exporting statement:', error);
      toast.error("Erreur lors de l'export");
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'assets':
        return <AssetsManagement />;
      case 'debts':
        return <DebtsManagement />;
      case 'tax':
        return <AccountingTaxesManagement />;
      case 'tips':
        return <AccountingTipsManagement />;
      default:
        return (
          <>
            <AccountingOverview stats={stats} isLoading={isLoading} />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <DateFilter
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDateChange={handleDateChange}
              />
              <div className="flex gap-2">
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une Transaction
                </Button>
                <Button
                  disabled={settingsLoading && !settings}
                  variant="secondary"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger les États financiers
                </Button>
              </div>
            </div>

            <TransactionList
              transactions={transactions}
              isLoading={isLoading}
              onUpdate={handleUpdateTransaction}
              onDelete={handleDeleteTransaction}
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderActiveTab()}

      {isFormOpen && (
        <TransactionForm
          onSave={handleSaveTransaction}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {settings && (
        <div className="hidden">
          <div ref={statementRef}>
            <FinancialStatement
              transactions={transactions}
              period={dateRange}
              settings={settings as any}
            />
          </div>
        </div>
      )}
    </div>
  );
}
