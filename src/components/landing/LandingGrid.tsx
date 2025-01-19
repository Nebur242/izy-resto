import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutMount } from '../../hooks/useLayoutMount';
import { Cart } from '../cart/Cart';
import { Footer } from '../layout/Footer';
import { HeaderWrapper } from '../layout/HeaderWrapper';
import { Container } from '../ui/Container';
import { LoadingScreen } from '../ui/LoadingScreen';
import { GridHero } from './grid/GridHero';
import { GridMenuSection } from './grid/GridMenuSection';

export function LandingGrid() {
  const { isLoading, isLayoutMounted } = useLayoutMount();

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen isLoading={true} />}
      </AnimatePresence>

      <AnimatePresence>
        {isLayoutMounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[var(--bg-color)]"
          >
            <HeaderWrapper />
            <GridHero />
            <main className="py-16 md:py-24">
              <Container>
                <section id="menu">
                  <GridMenuSection />
                </section>
              </Container>
            </main>
            <Footer />
            <Cart />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
