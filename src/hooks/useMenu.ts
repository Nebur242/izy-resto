import { useState, useEffect } from 'react';
import { MenuFilters, MenuItemWithVariants } from '../types';
import { menuService } from '../services/menu/menu.service';
import toast from 'react-hot-toast';

export function useMenu(categoryId?: string) {
  const [items, setItems] = useState<MenuItemWithVariants[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true);
        const filters: MenuFilters | undefined =
          categoryId && categoryId !== 'all'
            ? { category: categoryId }
            : undefined;
        const menuItems = await menuService.getMenuItems(filters);
        const menuItemsWithDefault = menuItems.map(menuItem => ({
          ...menuItem,
          variantPrices: menuItem.variantPrices,
        }));
        setItems(menuItemsWithDefault);
        setError(null);
      } catch (err) {
        console.error('Error loading menu items:', err);
        setError(err as Error);
        toast.error('Echec de chargement du menu');
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, [categoryId]);

  return { items, isLoading, error };
}
