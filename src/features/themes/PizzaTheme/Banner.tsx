import { ShoppingCart, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Banner() {
  return (
    <section className="bg-[#f4ecdf] flex flex-col-reverse lg:flex-row justify-between items-center h-auto lg:h-screen px-6 lg:px-20 py-10">
      <div className="w-full lg:w-[40%] text-center lg:text-left lg:ml-10">
        <span className="text-white bg-red-600 px-4 py-2 mb-3 inline-block rounded-md text-sm lg:text-base">
          Free Home delivery 24 Hours
        </span>
        <motion.h1
          className="my-5 text-4xl lg:text-7xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          ENJOY YOUR PIZZA IN TOWN
        </motion.h1>
        <ul className="py-5 space-y-2">
          <motion.li
            className="flex justify-center lg:justify-start items-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CheckCircle color="#f00" />
            <span className="ml-2 font-semibold text-sm lg:text-lg">
              lorem ipsum indolor
            </span>
          </motion.li>
          <motion.li
            className="flex justify-center lg:justify-start items-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <CheckCircle color="#f00" />
            <span className="ml-2 font-semibold text-sm lg:text-lg">
              Sit amet consectetur adpiscine
            </span>
          </motion.li>
          <motion.li
            className="flex justify-center lg:justify-start items-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <CheckCircle color="#f00" />
            <span className="ml-2 font-semibold text-sm lg:text-lg">
              Eliteytellus luctus nec
            </span>
          </motion.li>
        </ul>
        <motion.button
          className="flex justify-center lg:justify-start items-center bg-[#fcb302] font-bold text-lg rounded-full mt-4 px-5 lg:px-7 py-4 lg:py-5 mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <ShoppingCart color="#fff" />
          <span className="text-white ml-2">VOIR LE MENU</span>
        </motion.button>
      </div>
      <div className="w-full lg:w-[50%] mt-10 lg:mt-0 flex justify-center relative mb-11">
        <div className="relative before:hidden lg:before:block before:absolute before:top-[-30px] lg:before:top-[-60px] before:right-[-50px] lg:before:right-[-80px] before:w-[150px] lg:before:w-[300px] before:h-[180px] lg:before:h-[330px] before:bg-[url('https://radiustheme.com/demo/wordpress/themes/panpie/wp-content/uploads/2021/03/slider_shape_03.png')] before:bg-no-repeat before:bg-cover before:z-0 after:absolute after:bottom-[-30px] lg:after:bottom-[-50px] after:left-[30px] lg:after:left-[70px] after:w-[150px] lg:after:w-[300px] after:h-[150px] lg:after:h-[300px] after:bg-[url('https://radiustheme.com/demo/wordpress/themes/panpie/wp-content/uploads/2021/03/slider_shape_04.png')] after:bg-no-repeat after:bg-cover after:z-0 z-10">
          <motion.img
            src="https://radiustheme.com/demo/wordpress/themes/panpie/wp-content/uploads/2021/03/slide01-1.png"
            alt="Pizza"
            className="object-contain w-[300px] sm:w-[400px] md:w-[500px] lg:w-[1000px] max-w-full h-auto relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </section>
  );
}
