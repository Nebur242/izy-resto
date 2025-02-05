import { useCategories } from '../../../hooks/useCategories';
import { Button } from '../../ui/Button';
import { useTranslation } from 'react-i18next';

interface MinimalMenuCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MinimalMenuCategories({ activeCategory, onCategoryChange }: MinimalMenuCategoriesProps) {
  const { categories, isLoading } = useCategories();
  const { t } = useTranslation('menu');

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        variant={activeCategory === 'all' ? 'primary' : 'secondary'}
        onClick={() => onCategoryChange('all')}
        className="relative"
      >
        {t('all-items')}
      </Button>
      {categories.map(category => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? 'primary' : 'secondary'}
          onClick={() => onCategoryChange(category.id)}
          className="relative"
        >
          {t(category.name)}
        </Button>
      ))}
    </div>
  );
}