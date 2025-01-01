import { useEffect } from 'react';
import { useApi } from '../context/ApiContext';

export function useOptimizedCategories() {
  const { categories, refreshCategories } = useApi();

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  return {
    categories: categories.items,
    isLoading: !categories.lastFetched
  };
}