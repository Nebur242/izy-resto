import { motion } from 'framer-motion';
import { Container } from '../../ui/Container';
import { Button } from '../../ui/Button';
import { useSettings } from '../../../hooks/useSettings';

export function FastFoodHero() {
  const { settings } = useSettings();
  const featuredItem = settings?.featuredItem;

  return (
    <div className="relative min-h-[90vh] flex items-center bg-black">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${featuredItem?.image || settings?.coverImage})`,
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white space-y-8"
          >
            <div className="inline-block bg-red-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
              IT'S BACK!
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-none">
              BBQ<br />BRISKET<br />MELT
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold text-red-600">
              BRISKET<br />BOSSWICH
            </h2>
            <div className="bg-red-600 text-white text-xl font-bold px-6 py-3 rounded-full inline-block">
              3X MORE BRISKET
            </div>
            <div className="pt-4">
              <Button
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full"
              >
                Order Now
              </Button>
            </div>
          </motion.div>

          {featuredItem?.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:block"
            >
              <img
                src={featuredItem.image}
                alt={featuredItem.name}
                className="w-full h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          )}
        </div>
      </Container>
    </div>
  );
}