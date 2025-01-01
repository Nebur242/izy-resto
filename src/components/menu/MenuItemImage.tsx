import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { ProductDetailsModal } from './ProductDetailsModal';

interface MenuItemImageProps {
  item: MenuItem;
  className?: string;
}

export function MenuItemImage({ item, className = '' }: MenuItemImageProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <img
        src={item.image}
        alt={item.name}
        className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <ProductDetailsModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}