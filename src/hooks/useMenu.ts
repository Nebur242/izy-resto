
import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { menuService } from '../services/menu/menu.service';
import toast from 'react-hot-toast';

export function useMenu(categoryId?: string) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true);
        const filters = categoryId && categoryId !== 'all' ? { categoryId } : undefined;
        const menuItems = await menuService.getMenuItems(filters);
        setItems(menuItems);
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
