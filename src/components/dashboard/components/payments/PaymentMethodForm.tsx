import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../ui/Button';
import { PaymentMethod } from '../../../../types/payment';
import { LogoUploader } from '../../../settings/LogoUploader';
import { paymentService } from '../../../../services/payments/payment.service';
import toast from 'react-hot-toast';
import { useState, useEffect, useMemo } from 'react';

interface PaymentMethodFormProps {
  method?: PaymentMethod | null;
  onSave: (data: Omit<PaymentMethod, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const paymentType: Record<string, PaymentMethodType> = {
  Wave: 'Wave',
  PayTech: 'PayTech',
};

type PaymentMethodType = 'Wave' | 'PayTech' | 'Autres';

export function PaymentMethodForm({
  method,
  onSave,
  onCancel,
}: PaymentMethodFormProps) {
  const [methodType, setMethodType] = useState<PaymentMethodType>(
    paymentType[`${method?.name}`] ? paymentType[`${method?.name}`] : 'Autres'
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: method || {
      name: '',
      qrCode: '',
      url: '',
      isDefault: false,
    },
  });

  const isEditing = useMemo(() => !!method?.name, [method?.name]);

  // Reset form values when method type changes
  useEffect(() => {
    if (methodType === 'Wave') {
      return setValue('name', 'Wave');
    }

    if (methodType === 'PayTech') {
      return setValue('name', 'PayTech');
    }
  }, [methodType, setValue]);

  const handleFormSubmit = async (data: any) => {
    try {
      // Check for duplicate name
      const methods = await paymentService.getActivePaymentMethods();
      const nameExists = methods.some(
        m =>
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

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Type de méthode
            </label>
            <select
              value={methodType}
              disabled={isEditing}
              onChange={e => setMethodType(e.target.value as PaymentMethodType)}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
            >
              <option value="Wave">Wave</option>
              <option value="PayTech">PayTech</option>
              <option value="Autres">Autres</option>
            </select>
          </div>

          {methodType === 'Autres' && (
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
                      'Ce nom est réservé pour la méthode par défaut',
                  },
                })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          {methodType === 'Wave' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Lien de paiement Wave
              </label>
              <input
                type="url"
                {...register('url', {
                  required:
                    methodType === 'Wave' ? 'Le lien Wave est requis' : false,
                })}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                placeholder="https://pay.wave.com/m/xxxxxxxxxxxxxx/c/sn/?amount"
              />
              <small>Coller exactement jusqu'à "amount"</small>
              {errors.url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.url.message}
                </p>
              )}
            </div>
          )}

          {methodType === 'PayTech' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  API KEY
                </label>
                <input
                  type="text"
                  {...register('apiKey', {
                    required: 'API key obligatoire',
                  })}
                  className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                  placeholder="1afac858d4fa5ec74e3e3734c3829793eb6bd5f4602c84ac4a5069369812915e"
                />
                {errors.apiKey && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.apiKey.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  API SECRET
                </label>
                <input
                  type="text"
                  {...register('apiSecret', {
                    required: 'Le lien Wave est requis',
                  })}
                  className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                  placeholder="96bc36c11560f2151c4b43eee310cefabc2e9e9000f7e315c3ca3d279e3f98ac"
                />
                {errors.apiSecret && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.apiSecret.message}
                  </p>
                )}
              </div>
            </>
          )}

          {methodType === 'Autres' && (
            <LogoUploader
              value={watch('qrCode')}
              onChange={url => setValue('qrCode', url)}
              label="QR Code de paiement"
              description="Format recommandé: PNG avec fond transparent"
            />
          )}

          <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Enregistrement...'
                : method
                ? 'Mettre à jour'
                : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
