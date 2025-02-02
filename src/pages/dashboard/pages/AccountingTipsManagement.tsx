import { useEffect, useState } from 'react';
import { DateFilter } from '../../../components/dashboard/components/accounting/DateFilter';
import { Button } from '../../../components/ui';
import { DollarSign, Download, Package } from 'lucide-react';
import { useSettings } from '../../../hooks';
import { useOrders } from '../../../context/OrderContext';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDate } from '../../../utils';
import { formatCurrency } from '../../../utils/currency';
import { Pagination } from '../../../components/ui/Pagination';
import { Order } from '../../../types';

const ITEMS_PER_PAGE = 8;

const exportTipsToCSV = (
  orders: Order[],
  settings: any,
  dateRange: { from: Date; to: Date }
) => {
  // Calculate totals
  const totalTips = orders.reduce(
    (sum, order) => sum + (order.tip?.amount || 0),
    0
  );
  const averageTip = totalTips / orders.length;

  // Create headers
  const headers = [
    'Date',
    'Référence',
    'Montant Commande',
    'Pourboire',
    'Pourcentage',
    'Client',
    'Mode de paiement',
  ].join(',');

  // Create summary rows
  const summary = [
    `Période,${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`,
    `Total des pourboires,${formatCurrency(totalTips, settings?.currency)}`,
    `Moyenne des pourboires,${formatCurrency(averageTip, settings?.currency)}`,
    '', // Empty line between summary and data
  ].join('\n');

  // Create data rows
  const rows = orders
    .map(order => {
      return [
        formatDate(order.createdAt),
        order.id,
        formatCurrency(order.total, settings?.currency),
        formatCurrency(order.tip?.amount || 0, settings?.currency),
        order.tip?.percentage ? `${order.tip.percentage}%` : 'Personnalisé',
        order.customerName,
        order.paymentMethod?.name || '-',
      ].join(',');
    })
    .join('\n');

  // Combine all parts
  const csv = `${summary}\n${headers}\n${rows}`;

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `pourboires-${formatDate(dateRange.from)}-${formatDate(dateRange.to)}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const AccountingTipsManagement = () => {
  const { settings, isLoading: settingsLoading } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { getDateOrders } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = orders
    .filter(order => !!order?.tip)
    .sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date(),
  });

  const handleDateChange = (start: Date, end: Date) => {
    setDateRange({ from: start, to: end });
  };

  const handleExport = async () => {
    try {
      setIsDownloading(true);
      exportTipsToCSV(filteredOrders, settings, dateRange);
    } catch (error) {
      console.error('Error exporting tips:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsDownloading(false);
    }
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

  useEffect(() => {
    fetchOrders();
  }, [dateRange]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20`}>
              <DollarSign
                className={`w-6 h-6 text-blue-600 dark:text-blue-400`}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Taxes
              </p>
              <p className="text-2xl font-semibold">
                {formatCurrency(
                  filteredOrders.reduce((acc, curr) => {
                    return acc + (curr.tip?.amount || 0);
                  }, 0),
                  settings?.currency
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
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
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />

            {isDownloading
              ? 'Téléchargement en cours...'
              : 'Télécharger les pourboires'}
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
                  Pourboire
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
                      {formatCurrency(order?.tip?.amount, settings?.currency)}
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
            <p className="text-gray-500">Pas de pourboires trouvés</p>
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
