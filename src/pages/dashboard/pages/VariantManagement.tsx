import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useVariants } from '../../../hooks/useVariants';
import { useCategories } from '../../../hooks/useCategories';
import { Button } from '../../../components/ui/Button';
import { VariantList } from '../../../components/dashboard/components/variants/VariantList';
import { VariantForm } from '../../../components/dashboard/components/variants/VariantForm';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

export function VariantManagement() {
  const { variants, isLoading, addVariant, updateVariant, deleteVariant } = useVariants();
  const { categories } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, variantId: null });

  const handleSave = async (data: any) => {
    try {
      if (editingVariant) {
        await updateVariant(editingVariant.id, data);
      } else {
        await addVariant(data);
      }
      setIsFormOpen(false);
      setEditingVariant(null);
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation.variantId) {
      await deleteVariant(deleteConfirmation.variantId);
      setDeleteConfirmation({ isOpen: false, variantId: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Variantes</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les variantes de vos produits (tailles, options, etc.)
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une Variante
        </Button>
      </div>

      <VariantList
        variants={variants}
        categories={categories}
        isLoading={isLoading}
        onEdit={setEditingVariant}
        onDelete={(id) => setDeleteConfirmation({ isOpen: true, variantId: id })}
      />

      {(isFormOpen || editingVariant) && (
        <VariantForm
          variant={editingVariant}
          categories={categories}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingVariant(null);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, variantId: null })}
        onConfirm={handleDelete}
        title="Supprimer la variante"
        message="Êtes-vous sûr de vouloir supprimer cette variante ? Cette action est irréversible."
      />
    </div>
  );
}