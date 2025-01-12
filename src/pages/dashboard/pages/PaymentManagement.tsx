import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PaymentMethodForm } from '../../../components/dashboard/components/payments/PaymentMethodForm';
import { PaymentMethodList } from '../../../components/dashboard/components/payments/PaymentMethodList';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { usePayments } from '../../../hooks/usePayments';
import { PaymentMethod } from '../../../types/payment';

export function PaymentManagement() {
  const {
    paymentMethods,
    isLoading,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  } = usePayments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  );
  console.log(isLoading);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    methodId?: string;
  }>({ isOpen: false });

  const handleSave = async (data: Omit<PaymentMethod, 'id'>) => {
    try {
      if (editingMethod) {
        await updatePaymentMethod(editingMethod.id, data);
      } else {
        await addPaymentMethod(data);
      }
      setIsFormOpen(false);
      setEditingMethod(null);
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.methodId) return;

    try {
      await deletePaymentMethod(deleteConfirmation.methodId);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    } finally {
      setDeleteConfirmation({ isOpen: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Méthodes de Paiement</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les méthodes de paiement disponibles
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une méthode
        </Button>
      </div>

      <PaymentMethodList
        methods={paymentMethods}
        isLoading={isLoading}
        onEdit={method => {
          setEditingMethod(method);
          setIsFormOpen(true);
        }}
        onDelete={methodId =>
          setDeleteConfirmation({
            isOpen: true,
            methodId,
          })
        }
      />

      {isFormOpen && (
        <PaymentMethodForm
          method={editingMethod}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingMethod(null);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={handleDelete}
        title="Supprimer la méthode de paiement"
        message="Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?"
      />
    </div>
  );
}
