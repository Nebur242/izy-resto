import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import { HeaderWrapper } from '../layout/HeaderWrapper';
import { Hero } from '../layout/Hero';
import { MenuSection } from '../menu/MenuSection';
import { Container } from '../ui/Container';
import { Cart } from '../cart/Cart';
import { LoadingScreen } from '../ui/LoadingScreen';
import { useLayoutMount } from '../../hooks/useLayoutMount';
import { Footer } from '../layout/Footer';

export function LandingModern() {
  const { t } = useTranslation();
  const { isLoading, isLayoutMounted } = useLayoutMount();
  
  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen isLoading={true} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLayoutMounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900"
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