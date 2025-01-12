import { useCategories } from '../../../hooks/useCategories';
import { Button } from '../../ui/Button';

interface GridMenuCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function GridMenuCategories({
  activeCategory,
  onCategoryChange,
}: GridMenuCategoriesProps) {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      <Button
        variant={activeCategory === 'all' ? 'primary' : 'secondary'}
        onClick={() => onCategoryChange('all')}
        className="rounded-full px-6"
      >
        All Items
      </Button>
      {categories.map(category => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? 'primary' : 'secondary'}
          onClick={() => onCategoryChange(category.id)}
          className="rounded-full px-6"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
