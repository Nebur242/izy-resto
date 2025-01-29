import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutMount } from '../../hooks/useLayoutMount';
import { useTranslation } from '../../i18n/useTranslation';
import { Cart } from '../cart/Cart';
import { Footer } from '../layout/Footer';
import { HeaderWrapper } from '../layout/HeaderWrapper';
import { Hero } from '../layout/Hero';
import { MenuSection } from '../menu/MenuSection';
import { Container } from '../ui/Container';
import { LoadingScreen } from '../ui/LoadingScreen';

export function LandingModern() {
  const { t } = useTranslation();
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
          >
            <HeaderWrapper />
            <Hero />
            <main className="pt-10">
              <Container>
                <section id="menu" className="py-5">
                  <MenuSection />
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
