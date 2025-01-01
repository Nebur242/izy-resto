import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../ui/Button';
import { PaymentMethod } from '../../../../types/payment';
import { LogoUploader } from '../../../settings/LogoUploader';
import { paymentService } from '../../../../services/payments/payment.service';
import toast from 'react-hot-toast';

interface PaymentMethodFormProps {
  method?: PaymentMethod | null;
  onSave: (data: Omit<PaymentMethod, 'id'>) => void;
  onCancel: () => void;
}

export function PaymentMethodForm({ method, onSave, onCancel }: PaymentMethodFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: method || {
      name: '',
      qrCode: '',
      isDefault: false
    }
  });

  const handleFormSubmit = async (data: any) => {
    try {
      // Check for duplicate name
      const methods = await paymentService.getActivePaymentMethods();
      const nameExists = methods.some(m => 
        m.name.toLowerCase() === data.name.toLowerCase() &&
        m.id !== method?.id
      );

      if (nameExists) {
        toast.error('Une méthode de paiement avec ce nom existe déjà');
        return;
      }

      await onSave(data);
    } catch (error: any) {
      if (error.code === 'payment/duplicate-name') {
        toast.error('Une méthode de paiement avec ce nom existe déjà');
      } else {
        toast.error('Une erreur est survenue');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {method ? 'Modifier la méthode' : 'Nouvelle méthode de paiement'}
          </h2>
          <button onClick={onCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom de la méthode
            </label>
            <input
              type="text"
              {...register('name', { 
                required: 'Le nom est requis',
                validate: {
                  notDefault: value => 
                    value.toLowerCase() !== 'paiement à la livraison' || 
                    'Ce nom est réservé pour la méthode par défaut'
                }
              })}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <LogoUploader
              value={watch('qrCode')}
              onChange={(url) => setValue('qrCode', url)}
              label="QR Code de paiement"
              description="Format recommandé: PNG avec fond transparent"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : method ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}