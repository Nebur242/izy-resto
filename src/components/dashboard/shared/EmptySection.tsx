import { LayoutGrid } from 'lucide-react';
import { FC } from 'react';

type EmptySectionProps = {
  title: string;
  description?: string;
};

const EmptySection: FC<EmptySectionProps> = ({ title, description }) => {
  return (
    <div className="p-8 text-center">
      <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default EmptySection;
