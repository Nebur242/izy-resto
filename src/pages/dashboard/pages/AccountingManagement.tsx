import { useState, useRef } from 'react';
import { Tabs } from '../../../components/ui/Tabs';
import { AccountingOverview } from '../../../components/dashboard/components/accounting/AccountingOverview';
import { TransactionList } from '../../../components/dashboard/components/accounting/TransactionList';
import { DateFilter } from '../../../components/dashboard/components/accounting/DateFilter';
import { AssetsManagement } from '../../../components/dashboard/components/accounting/AssetsManagement';
import { DebtsManagement } from '../../../components/dashboard/components/accounting/DebtsManagement';
import { Button } from '../../../components/ui/Button';
import { Plus, Download } from 'lucide-react';
import { useAccounting } from '../../../hooks/useAccounting';
import { TransactionForm } from '../../../components/dashboard/components/accounting/TransactionForm';
import { FinancialStatement } from '../../../components/dashboard/components/accounting/FinancialStatement';
import { accountingService } from '../../../services/accounting/accounting.service';
import { exportToPdf } from '../../../utils/export';
import toast from 'react-hot-toast';
import { useSettings } from '../../../hooks';
import { AccountingTaxesManagement } from './AccountingTaxesManagement';
import { AccountingTipsManagement } from './AccountingTipsManagement';
import { AccountingDeliveryManagement } from './AccountingDeliveryManagement';

const tabs = [
  { id: 'transactions', label: 'Transactions' },
  { id: 'tax', label: 'Taxes' },
  { id: 'tips', label: 'Pourboires' },
  { id: 'delivery', label: 'Livraison' },
];

export function AccountingManagement() {
  const { settings, isLoading: settingsLoading } = useSettings();

  const [activeTab, setActiveTab] = useState('transactions');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(0)), // First day of current month
    endDate: new Date(),
  });
  const [isDownloading, setIsDownloading] = useState(false);
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

  // Update the handleExport function
  const handleExport = async () => {
    if (!statementRef.current || !settings) return;

    try {
      setIsDownloading(true);
      // Ensure we have the latest transactions for the selected period
      const fetchedTransactions = await accountingService.getTransactions(
        dateRange
      );

      // Update the ref content with fresh data
      const statement = (
        <FinancialStatement
          transactions={fetchedTransactions}
          period={dateRange}
          settings={settings as any}
        />
      );

      // Render the statement into the hidden div
      const root = document.createElement('div');
      root.style.position = 'absolute';
      root.style.left = '-9999px';
      document.body.appendChild(root);

      const { createRoot } = await import('react-dom/client');
      const reactRoot = createRoot(root);
      await new Promise<void>(resolve => {
        reactRoot.render(<div ref={statementRef}>{statement}</div>);
        // Wait for render to complete
        setTimeout(resolve, 100);
      });

      // Export to PNG
      await exportToPdf(root);

      // Cleanup
      document.body.removeChild(root);
      reactRoot.unmount();

      toast.success('États financiers exportés avec succès');
    } catch (error) {
      console.error('Error exporting statement:', error);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsDownloading(false);
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
      case 'delivery':
        return <AccountingDeliveryManagement />;
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
                  disabled={(settingsLoading && !settings) || isDownloading}
                  variant="secondary"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading
                    ? 'Téléchargement en cours...'
                    : 'Télécharger les États financiers'}
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
