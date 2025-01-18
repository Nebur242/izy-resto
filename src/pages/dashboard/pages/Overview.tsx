import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../../i18n/useTranslation';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { DateFilter } from '../../../components/dashboard/components/accounting/DateFilter';
import { AnalyticsGrid } from '../../../components/dashboard/analytics/AnalyticsGrid';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { ProductSalesStats } from '../../../components/dashboard/components/analytics/ProductSalesStats';
import { PaginatedCustomerList } from '../../../components/dashboard/PaginatedCustomerList';
import { PaginatedRecentOrders } from '../../../components/dashboard/PaginatedRecentOrders';
import { RevenueDetails } from '../../../components/dashboard/RevenueDetails';
import { useOrdersRealtime } from '../../../hooks/useOrdersRealtime';
import { Laptop } from 'lucide-react';

export function Overview() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(0)), // First day of current month
    endDate: new Date(),
  });

  const { orders, isLoading } = useOrdersRealtime();

  // Filter orders based on date range
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt.seconds * 1000);
      return orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
    });
  }, [orders, dateRange]);

  // Only consider delivered orders for revenue calculations
  const deliveredOrders = useMemo(() => {
    return filteredOrders.filter(order => order.status === 'delivered');
  }, [filteredOrders]);

  // Calculate analytics
  const analytics = useMemo(() => {
    // Calculate days between start and end date
    const daysDiff = Math.max(
      1,
      Math.ceil(
        (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    // Calculate daily order rate
    const dailyOrderRate = filteredOrders.length / daysDiff;

    return {
      totalRevenue: deliveredOrders.reduce(
        (sum, order) => sum + order.total,
        0
      ),
      totalOrders: filteredOrders.length,
      uniqueCustomers: new Set(
        filteredOrders.map(order => order.customerEmail || order.customerPhone)
      ).size,
      dailyOrderRate: Math.round(dailyOrderRate * 10) / 10, // Round to 1 decimal place
    };
  }, [filteredOrders, deliveredOrders, dateRange]);

  // Mobile message for limited view
  if (isMobile) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <Laptop className="w-12 h-12 mx-auto text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Vue limitée sur mobile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Pour une meilleure expérience et accéder à toutes les
            fonctionnalités, veuillez utiliser un écran plus large.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Commandes Récentes</h3>
          <PaginatedRecentOrders orders={filteredOrders} itemsPerPage={5} />
        </div>
        <AnalyticsGrid {...analytics} />
        <ProductSalesStats orders={filteredOrders} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t('dashboard.overview')}
        </h2>
        <DateFilter
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onDateChange={(start, end) =>
            setDateRange({ startDate: start, endDate: end })
          }
        />
      </div>

      <AnalyticsGrid {...analytics} />

      {/* Product Sales Stats */}
      <ProductSalesStats orders={filteredOrders} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">
            {t('analytics.revenue')}
          </h3>
          <RevenueDetails orders={deliveredOrders} dateRange={dateRange} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">État des commandes</h3>
          <AnalyticsChart
            data={filteredOrders.reduce((acc, order) => {
              acc[order.status] = (acc[order.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">{t('orders.recent')}</h3>
          <PaginatedRecentOrders orders={filteredOrders} itemsPerPage={5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Meilleurs clients</h3>
          <PaginatedCustomerList
            orders={filteredOrders.filter(order => !!order.customerPhone)}
            itemsPerPage={5}
          />
        </motion.div>
      </div>
    </div>
  );
}
