import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useTranslation } from 'react-i18next';

interface OrderTrackingLinkProps {
  orderId: string;
}

export function OrderTrackingLink({ orderId }: OrderTrackingLinkProps) {
  const { t } = useTranslation('order');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-6 sm:p-8 text-white shadow-lg"
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="p-3 sm:p-4 bg-white/20 rounded-lg">
          <Truck className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">
            {t('order-tracking')}
          </h3>
          <p className="text-blue-100">{t('real-time-order-tracking')}</p>
        </div>
      </div>
      <Link to={`/order/${orderId}`} className="block">
        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 group flex items-center justify-center">
          <span className="mr-2">{t('track-order')}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </motion.div>
  );
}
