import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';
import { Cart } from '../cart/Cart';
import { Header } from '../layout/Header';
import { Container } from '../ui/Container';
import { FastFoodCategories } from './sections/FastFoodCategories';
import { FastFoodHero } from './sections/FastFoodHero';
import { FastFoodMenu } from './sections/FastFoodMenu';

export function LandingFastFood() {
  const { settings } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <Header />

      {/* Hero Section with Featured Item */}
      <FastFoodHero />

      {/* Menu Categories */}
      <section className="py-16">
        <Container>
          <FastFoodCategories />
        </Container>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16">
        <Container>
          <FastFoodMenu />
        </Container>
      </section>

      {/* Cart */}
      <Cart />
    </motion.div>
  );
}
