import { useMemo } from 'react';
import { MenuItem } from '../types';

export function useFilteredMenu(items: MenuItem[], selectedCategory: string) {
  return useMemo(() => {
    if (selectedCategory === 'all') {
      return items;
    }
    return items.filter(item => item.categoryId === selectedCategory);
  }, [items, selectedCategory]);
}