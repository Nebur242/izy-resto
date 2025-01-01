import { useEffect, useMemo } from 'react';
import { useApi } from '../context/ApiContext';

export function useOptimizedMenu(categoryId?: string) {
  const { menu, refreshMenu } = useApi();

  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]);

  const filteredItems = useMemo(() => {
    if (!categoryId || categoryId === 'all') {
      return menu.items;
    }
    return menu.items.filter(item => item.categoryId === categoryId);
  }, [menu.items, categoryId]);

  return {
    items: filteredItems,
    isLoading: !menu.lastFetched
  };
}