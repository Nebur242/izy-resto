import { Header } from '../../../components/layout';
import Banner from './Banner';
import FooterBanner from './FooterBanner';
import OrderNow from './OrderNow';
import Partner from './partner';
import Cta from './Cta';
import Footer from './Footer';
import ProductList from './ProductList';
import { LoadingScreen } from '../../../components/ui/LoadingScreen';
import { AnimatePresence } from 'framer-motion';
import { useLayoutMount } from '../../../hooks/useLayoutMount';
import { Cart } from '../../../components/cart/Cart';

export default function PizzaTheme() {
  const { isLoading } = useLayoutMount();
  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen isLoading={true} />}
      </AnimatePresence>
      <Header
        defaultHeaderStyle="border-b border-[#eddfc6]"
        scrollHeaderStyle="bg-[#f4ecdf]"
      />
      <Banner />
      <ProductList />
      <FooterBanner />
      <OrderNow />
      <Cta />
      <Partner />
      <Footer />
      <Cart
        cartBgColor="bg-[#fcb302] hover:bg-[#fcb302]"
        orderBgColor="bg-[#fcb302] hover:bg-[#fcb302]"
        totalCartAmount="text-[#fcb302]"
        deliveryTitleStyle="border-[#fcb302] bg-[#f4ecdf]"
        truckStyle="text-[#fcb302]"
      />
    </>
  );
}
