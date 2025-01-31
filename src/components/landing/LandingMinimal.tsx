import { motion, AnimatePresence } from 'framer-motion';
import { HeaderWrapper } from '../layout/HeaderWrapper';
import { MinimalMenuSection } from '../menu/minimal/MinimalMenuSection';
import { Container } from '../ui/Container';
import { Cart } from '../cart/Cart';
import { Footer } from '../layout/Footer';
import { LoadingScreen } from '../ui/LoadingScreen';
import { useLayoutMount } from '../../hooks/useLayoutMount';

export function LandingMinimal() {
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
            className="min-h-screen bg-white dark:bg-gray-900"
          >
            <HeaderWrapper />
            <main className="bg-white dark:bg-gray-900 transition-colors">
              <Container>
                <section id="menu" className="py-16">
                  <MinimalMenuSection />
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
