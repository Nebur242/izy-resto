import { motion } from 'framer-motion';
import { useSettings } from '../../../hooks/useSettings';
import { Button } from '../../ui/Button';
import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function GridHero() {
  const { settings } = useSettings();
  const coverImage =
    settings?.coverImage ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';

  const { t } = useTranslation('hero');

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
            {t(settings?.name || 'grid-hero-title')}
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            {t(settings?.description || 'grid-hero-description')}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() =>
                document
                  .getElementById('menu')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="mt-8 px-8 py-4 text-lg rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {t('view-menu')}
              <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
