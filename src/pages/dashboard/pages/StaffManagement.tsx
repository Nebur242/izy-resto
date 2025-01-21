import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { StaffList } from '../../../components/dashboard/components/staff/StaffList';
import { StaffForm } from '../../../components/dashboard/components/staff/StaffForm';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useStaff } from '../../../hooks/useStaff';
import { StaffMember } from '../../../types/staff';
import toast from 'react-hot-toast';
import { useStaffCheck } from '../../../hooks/useStaffCheck';

export function StaffManagement() {
  const { staff, isLoading, createStaff, updateStaff, deleteStaff } =
    useStaff();
  const { isStaff, staffData } = useStaffCheck();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    member: StaffMember | null;
  }>({ isOpen: false, member: null });

  const handleCreate = async (data: any) => {
    try {
      await createStaff(data);
      setIsFormOpen(false);
      toast.success('Membre du personnel créé avec succès');
    } catch (error) {
      console.error('Error creating staff:', error);
      // toast.error('Erreur lors de la création');
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingStaff) return;

    try {
      await updateStaff(editingStaff.id, data);
      setEditingStaff(null);
      setIsFormOpen(false);
      toast.success('Membre du personnel mis à jour avec succès');
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.member) return;

    try {
      await deleteStaff(deleteConfirmation.member.id);
      toast.success('Membre du personnel supprimé avec succès');
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteConfirmation({ isOpen: false, member: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion du Personnel</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les comptes du personnel et leurs accès
          </p>
        </div>
        {((isStaff && staffData?.role === 'admin') || !isStaff) && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un membre
          </Button>
        )}
      </div>

      <StaffList
        staff={staff}
        isLoading={isLoading}
        onEdit={member => {
          setEditingStaff(member);
          setIsFormOpen(true);
        }}
        onDelete={member =>
          setDeleteConfirmation({
            isOpen: true,
            member,
          })
        }
      />

      {isFormOpen && (
        <StaffForm
          staff={editingStaff}
          onSave={editingStaff ? handleEdit : handleCreate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingStaff(null);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, member: null })}
        onConfirm={handleDelete}
        title="Supprimer le membre"
        message={`Êtes-vous sûr de vouloir supprimer ${deleteConfirmation.member?.name} ? Cette action est irréversible.`}
      />
    </div>
  );
}
