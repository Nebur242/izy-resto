import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ReceiptRatingPromptProps {
  orderId: string;
}

export function ReceiptRatingPrompt({ orderId }: ReceiptRatingPromptProps) {
  const { t } = useTranslation('order');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center shadow-lg"
    >
      <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
      <h3 className="text-xl font-semibold mb-2">{t('your-opinion')}</h3>
      <p className="text-white/80 mb-4">{t('help-us-to-improve')}</p>
      <Link to={`/order/${orderId}`}>
        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
          {t('rate-order')}
        </Button>
      </Link>
    </motion.div>
  );
}
