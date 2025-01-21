import { useEffect, useState } from 'react';
import { DateFilter } from '../../../components/dashboard/components/accounting/DateFilter';
import { Button } from '../../../components/ui';
import { Download, Package } from 'lucide-react';
import { useSettings } from '../../../hooks';
import { useOrders } from '../../../context/OrderContext';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDate } from '../../../utils';
import { formatCurrency } from '../../../utils/currency';
import { Pagination } from '../../../components/ui/Pagination';
import { Order } from '../../../types';

const ITEMS_PER_PAGE = 8;

export async function generateTaxReportCSV(
  orders: Order[],
  settings?: any,
  dateRange?: { from: Date; to: Date }
): Promise<void> {
  try {
    // Calculate tax totals
    const taxTotals = new Map<string, { amount: number; rate: number }>();
    let totalHT = 0;
    let totalTTC = 0;

    orders.forEach(order => {
      totalHT += order.subtotal;
      totalTTC += order.total;

      order.taxes.forEach(tax => {
        const existing = taxTotals.get(tax.name);
        if (existing) {
          existing.amount += tax.amount;
        } else {
          taxTotals.set(tax.name, { amount: tax.amount, rate: tax.rate });
        }
      });
    });

    // Create CSV content
    let csvContent = '';

    // Add header info
    csvContent += `${settings?.name || 'Restaurant'}\n`;
    csvContent += `Rapport des taxes\n`;
    csvContent += `Période: ${formatDate(dateRange?.from)} - ${formatDate(
      dateRange?.to
    )}\n\n`;

    // Add summary section
    csvContent += 'Résumé\n';
    csvContent += `Total HT,${formatCurrency(totalHT, settings?.currency)}\n`;
    csvContent += `Total Taxes,${formatCurrency(
      totalTTC - totalHT,
      settings?.currency
    )}\n`;
    csvContent += `Total TTC,${formatCurrency(
      totalTTC,
      settings?.currency
    )}\n\n`;

    // Add tax summary
    csvContent += 'Résumé par type de taxe\n';
    csvContent += 'Type de taxe,Taux,Montant total\n';
    Array.from(taxTotals.entries()).forEach(([name, data]) => {
      csvContent += `${name},${(data.rate * 100).toFixed(2)}%,${formatCurrency(
        data.amount,
        settings?.currency
      )}\n`;
    });
    csvContent += '\n';

    // Add detailed transactions
    csvContent += 'Détail des transactions\n';
    csvContent +=
      'Date,Référence,Montant HT,Détails des taxes,Total Taxes,Total TTC\n';

    orders.forEach(order => {
      const taxDetails = order.taxes
        .map(
          tax =>
            `${tax.name} (${(tax.rate * 100).toFixed(2)}%): ${formatCurrency(
              tax.amount,
              settings?.currency
            )}`
        )
        .join(' | ');

      csvContent +=
        [
          formatDate(order.createdAt),
          `#${order.id}`,
          formatCurrency(order.subtotal, settings?.currency),
          taxDetails,
          formatCurrency(order.taxTotal, settings?.currency),
          formatCurrency(order.total, settings?.currency),
        ].join(',') + '\n';
    });

    // Create and download file
    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `taxes-${formatDate(dateRange?.from)}-${formatDate(dateRange?.to)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating tax report CSV:', error);
    throw new Error('Failed to generate tax report CSV');
  }
}

export const AccountingTaxesManagement = () => {
  const { settings, isLoading: settingsLoading } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  console.log(orders);

  const { getDateOrders } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = orders.filter(order => order?.taxes?.length > 0);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(0)),
    to: new Date(),
  });

  const handleDateChange = (start: Date, end: Date) => {
    setDateRange({ from: start, to: end });
  };

  const fetchOrders = async () => {
    setLoading(true);
    const response = await getDateOrders({
      startDate: dateRange.from,
      endDate: dateRange.to,
    });
    setOrders(response);
    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await generateTaxReportCSV(filteredOrders, settings, dateRange);
      setIsDownloading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dateRange]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DateFilter
          startDate={dateRange.from}
          endDate={dateRange.to}
          onDateChange={handleDateChange} //   onDateChange={handleDateChange}
        />
        <div className="flex gap-2">
          <Button
            disabled={(settingsLoading && !settings) || isDownloading}
            variant="secondary"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading
              ? 'Téléchargement en cours...'
              : 'Télécharger les taxes'}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Référence
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Taxes
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Total Taxes
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Montant (HT)
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Montant (TTC)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence mode="wait">
                {paginatedOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                    }}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {order.taxes.map(tax => (
                        <div>
                          <p>
                            {tax.name} ({tax.rate}%) :{' '}
                            {formatCurrency(tax.amount, settings?.currency)}
                          </p>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {formatCurrency(order.taxTotal, settings?.currency)}
                    </td>

                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {formatCurrency(order.subtotal, settings?.currency)}
                    </td>

                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {formatCurrency(order.total, settings?.currency)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!loading && paginatedOrders.length < 1 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Pas de taxes trouvées</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
};
