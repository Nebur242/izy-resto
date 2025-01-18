import { useState, useEffect } from 'react';
import { Category } from '../types';
import { categoryService } from '../services/categories/category.service';
import toast from 'react-hot-toast';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Echec de chargement des catégories');
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const id = await categoryService.create(category);
      setCategories(prev => [...prev, { ...category, id }]);
   
      return id;
    } catch (error) {
      console.error('Error adding category:', error);

      throw error;
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      await categoryService.update(id, data);
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, ...data } : cat)
      );
 
    } catch (error) {
      console.error('Error updating category:', error);

      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryService.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));

    } catch (error) {
      console.error('Error deleting category:', error);

      throw error;
    }
  };

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: loadCategories
  };
}