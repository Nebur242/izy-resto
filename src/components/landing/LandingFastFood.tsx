import { motion } from 'framer-motion';
import { Header } from '../layout/Header';
import { Container } from '../ui/Container';
import { Cart } from '../cart/Cart';
import { useSettings } from '../../hooks/useSettings';
import { FastFoodHero } from './sections/FastFoodHero';
import { FastFoodMenu } from './sections/FastFoodMenu';
import { FastFoodCategories } from './sections/FastFoodCategories';

export function LandingFastFood() {
  const { settings } = useSettings();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black"
    >
      <Header />
      
      {/* Hero Section with Featured Item */}
      <FastFoodHero />

      {/* Menu Categories */}
      <section className="py-16 bg-black">
        <Container>
          <FastFoodCategories />
        </Container>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-gradient-to-b from-black to-red-900">
        <Container>
          <FastFoodMenu />
        </Container>
      </section>

      {/* Cart */}
      <Cart />
    </motion.div>
  );
}