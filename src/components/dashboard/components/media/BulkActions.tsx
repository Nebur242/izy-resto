import { motion } from 'framer-motion';
import { Trash2, Upload } from 'lucide-react';
import { Button } from '../../../ui/Button';

interface BulkActionsProps {
  selectedCount: number;
  onUpload: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

export function BulkActions({ 
  selectedCount,
  onUpload,
  onDelete,
  onClearSelection
}: BulkActionsProps) {
  if (selectedCount === 0) {
    return (
      <Button onClick={onUpload}>
        <Upload className="w-4 h-4 mr-2" />
        Ajouter des médias
      </Button>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
      </span>
      
      <Button variant="danger" onClick={onDelete}>
        <Trash2 className="w-4 h-4 mr-2" />
        Supprimer
      </Button>
      
      <Button variant="secondary" onClick={onClearSelection}>
        Annuler
      </Button>
    </motion.div>
  );
}