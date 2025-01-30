import React, { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
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
    } catch (error: any) {
      if (error?.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            toast.error('Cette adresse mail est déjà utilisée...');
            break;
          case 'auth/invalid-email':
            toast.error("L'adresse e-mail fournie n'est pas valide.");
            break;
          case 'auth/weak-password':
            toast.error('Le mot de passe est trop faible.');
            break;
          case 'auth/operation-not-allowed':
            toast.error("Cette opération n'est pas autorisée.");
            break;
          case 'auth/network-request-failed':
            toast.error('Problème de connexion Internet, veuillez réessayer.');
            break;
          default:
            toast.error('Une erreur est survenue...');
            console.error('Firebase Auth Error:', error);
        }
      } else {
        toast.error(error?.message || 'Une erreur est survenue...');
        console.error('Error creating staff:', error);
      }
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

      {((isStaff && staffData?.role === 'admin') || !isStaff) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium text-amber-800 dark:text-amber-400">
              Important
            </h3>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-amber-700 dark:text-amber-300 font-bold">
              Pour supprimer un membre du personnel, connectez-vous à son
              compte, puis cliquez sur le bouton avec l'icône de suppression
              pour confirmer l'action.
            </p>
          </div>
        </div>
      )}

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
