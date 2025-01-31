import { Header } from '../../../components/layout';
import Banner from './Banner';
import FooterBanner from './FooterBanner';
import OrderNow from './OrderNow';
import Partner from './partner';
import Cta from './Cta';
import Footer from './Footer';
import ProductList from './ProductList';

export default function PizzaTheme() {
  return (
    <>
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
    </>
  );
}
