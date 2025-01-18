import DarciaThemeContact from '../components/contact';
import DarciaThemeFooter from '../components/footer/footer';
import DarciaThemeHeader from '../components/header';
import DarciaThemeHero from '../components/hero';
import DarciaThemeProducts from '../components/products';
import DarciaThemeServices from '../components/services';

const DarciaThemePage = () => {
  return (
    <div className="dark:bg-[#1E2923] text-white dark:text-green-700">
      <DarciaThemeHeader />
      <DarciaThemeHero />
      <DarciaThemeProducts />
      <DarciaThemeServices />
      <DarciaThemeContact />
      <DarciaThemeFooter />
    </div>
  );
};

export default DarciaThemePage;
