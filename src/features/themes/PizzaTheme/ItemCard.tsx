import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { ProductDetailsModal } from '../../../components/menu/ProductDetailsModal';

interface IitemCradProps {
  title: string;
  imageUrl: string;
  shortDescription: string;
  price: number;
  size: 'small' | 'medium' | 'large';
}

export default function ItemCard(props: IitemCradProps) {
  const { imageUrl, title, shortDescription, price, size } = props;
  const [selectedSize, setSelectedSize] = useState(size);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const priceMap: Record<'small' | 'medium' | 'large', number> = {
    small: price,
    medium: price * 1.2,
    large: price * 1.5,
  };

  const item = {
    id: '1',
    categoryId: '2',
    stockQuantity: 10,
    name: title,
    description: shortDescription,
    price,
    image: imageUrl,
    variantPrices: [],
  };

  return (
    <div
      className="flex flex-col items-center w-full sm:w-[45%] md:w-[30%] lg:w-[20%] min-w-[250px] max-w-sm border border-gray-300 rounded-xl mx-3 mb-5"
      role="button"
      onClick={() => setShowModal(true)}
    >
      <div className="relative w-[100%] h-[250px]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="flex flex-col items-start my-5 sm:my-11 w-full px-5 sm:px-10">
        <h1 className="text-lg sm:text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm sm:text-base">{shortDescription}</p>
      </div>
      <div className="flex items-center mt-5 sm:mt-11 mb-3 sm:mb-5 relative w-full px-5 sm:px-10 pb-3">
        <div className="relative w-full">
          <button
            className="flex justify-between items-center border pl-3 border-gray-300 rounded-full text-xs sm:text-sm w-full focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedSize}
            <div className="bg-[#fcb302]  rounded-r-full px-3 py-2 flex items-center">
              <ChevronDownIcon
                className={`w-4 h-4 text-white transform transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </div>
          </button>

          {isDropdownOpen && (
            <ul className="absolute left-0 bottom-full w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md z-10">
              {['small', 'medium', 'large'].map(size => (
                <li
                  key={size}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedSize(size as 'small' | 'medium' | 'large');
                    setIsDropdownOpen(false);
                  }}
                >
                  {size}
                </li>
              ))}
            </ul>
          )}
        </div>

        <span className="text-lg sm:text-xl font-bold text-red-500 ml-3">
          ${priceMap[selectedSize].toFixed(2)}
        </span>
      </div>

      {showModal && (
        <ProductDetailsModal
          addProductToCartBgColor="bg-yellow-500 text-white"
          stockAvailableBgColor="bg-[#f4ecdf] text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          priceStyle="text-[#fcb302]"
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
