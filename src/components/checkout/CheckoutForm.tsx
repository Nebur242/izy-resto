import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orders/order.service';
import toast from 'react-hot-toast';
import { Utensils, Truck, AlertCircle, X } from 'lucide-react';
import { OrderConfirmation } from './OrderConfirmation';
import { PaymentMethod } from '../../types/payment';
import { useSettings } from '../../hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { DeliveryZone } from '../../types';
import { DeliveryZoneSelect } from './DeliveryZoneSelect';
import { formatCurrency } from '../../utils/currency';

interface CheckoutFormData {
  name?: string;
  phone: string;
  address?: string;
  tableNumber?: string;
  preference?: string;
}

interface CheckoutFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

type DiningOption = 'dine-in' | 'delivery';
type CheckoutStep = 'form' | 'confirmation';

export function CheckoutForm({ onCancel, onSuccess }: CheckoutFormProps) {
  const navigate = useNavigate();
  const {
    cart,
    total,
    clearCart,
    subtotal,
    tip,
    setDeliveryZone,
    deliveryZone,
  } = useCart();
  const { settings } = useSettings();
  // const { paymentMethods } = usePayments();
  const [diningOption, setDiningOption] = useState<DiningOption | null>(null);

  const [step, setStep] = useState<CheckoutStep>('form');
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  // console.log(selectedZone);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      tableNumber: '',
    },
  });

  const validatePhone = (value: string) => {
    if (diningOption === 'dine-in' && !value) return true;

    const cleanedNumber = value.replace(/[^\d+]/g, '');

    if (cleanedNumber.replace('+', '').length < 8) {
      return 'Le numéro doit contenir au moins 8 chiffres';
    }

    if (cleanedNumber.startsWith('+')) {
      if (!/^\+\d{8,}$/.test(cleanedNumber)) {
        return 'Format international invalide (+XXX...)';
      }
    } else if (!/^\d{8,}$/.test(cleanedNumber)) {
      return 'Le numéro doit contenir uniquement des chiffres';
    }

    return true;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (step === 'form') {
      const isValid = await trigger();
      if (isValid) {
        setStep('confirmation');
      }
      return;
    }

    try {
      // Add delivery fee to total if applicable

      console.log(deliveryZone, total);

      const orderId = await orderService.createOrder({
        items: cart,
        status: 'pending',
        subtotal,
        total,
        tip,
        customerName: data.name || `Table ${data.tableNumber}`,
        customerPhone: data.phone,
        customerAddress: diningOption === 'delivery' ? data.address : undefined,
        tableNumber: diningOption === 'dine-in' ? data.tableNumber : undefined,
        diningOption,
        preference: data.preference,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: selectedPaymentMethod,
        taxRates: settings?.taxes.rates || [],
        delivery: deliveryZone,
      });

      toast.success(
        diningOption === 'dine-in'
          ? '✨ Commande passée avec succès! Veuillez patienter à votre table.'
          : '🚚 Commande passée avec succès! Nous vous livrerons sous peu.'
      );

      clearCart();
      onSuccess?.();
      const order = await orderService.getOrderById(orderId);
      navigate(`/order/${order?.id}`);
    } catch (error: any) {
      console.log('Error creating order:', error?.code);
      if (error?.code?.includes('rate-limit')) {
        setRateLimitError(error?.message || 'Rate limit atteint...');
      }
      toast.error('Échec de la commande. Veuillez réessayer.');
      setStep('form');
    }
  };

  useEffect(() => {
    if (settings?.canDeliver && !settings.canDineIn) {
      setDiningOption('delivery');
    }

    if (settings?.canDineIn && !settings.canDeliver) {
      setDiningOption('dine-in');
    }

    if (settings?.canDeliver && settings.canDineIn) {
      setDiningOption('delivery');
    }
  }, [settings]);

  useEffect(() => {}, [settings]);

  if (diningOption === null) {
    // Render a fallback or nothing while initializing
    return null;
  }

  const formData = watch();

  if (step === 'confirmation') {
    return (
      <OrderConfirmation
        customerData={{
          ...formData,
          diningOption,
        }}
        onConfirm={() => handleSubmit(onSubmit)()}
        onBack={() => setStep('form')}
        showPaymentMethods={diningOption === 'delivery'}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Dining Options */}
      <div className="grid grid-cols-2 gap-3">
        {settings?.canDeliver && (
          <button
            type="button"
            onClick={() => setDiningOption('delivery')}
            className={`
           p-4 rounded-xl border-2 transition-all duration-200
           flex flex-col items-center gap-2 relative overflow-hidden
           ${
             diningOption === 'delivery'
               ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
               : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
           }
         `}
          >
            {diningOption === 'delivery' && (
              <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/10" />
            )}
            <Truck
              className={`w-6 h-6 ${
                diningOption === 'delivery'
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            />
            <span className="font-medium text-sm">Livraison</span>
          </button>
        )}

        {settings?.canDineIn && (
          <button
            type="button"
            onClick={() => setDiningOption('dine-in')}
            className={`
             p-4 rounded-xl border-2 transition-all duration-200
             flex flex-col items-center gap-2 relative overflow-hidden
             ${
               diningOption === 'dine-in'
                 ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                 : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
             }
           `}
          >
            {diningOption === 'dine-in' && (
              <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/10" />
            )}
            <Utensils
              className={`w-6 h-6 ${
                diningOption === 'dine-in'
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            />
            <span className="font-medium text-sm">Sur place</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom (Optionnel)
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
              placeholder="Votre nom"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Téléphone {diningOption === 'dine-in' ? '(Optionnel)' : '*'}
            </label>
            <div className="relative">
              <input
                type="tel"
                {...register('phone', {
                  required:
                    diningOption === 'delivery'
                      ? 'Le numéro de téléphone est requis'
                      : false,
                  validate: validatePhone,
                })}
                className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow pr-10
                 ${errors.phone ? 'border-red-500 dark:border-red-500' : ''}
               `}
                placeholder="Numéro de téléphone"
              />
              {errors.phone && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Conditional Fields */}
          {diningOption === 'dine-in' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numéro de table
              </label>
              <input
                type="text"
                {...register('tableNumber', {
                  required: 'Le numéro de table est requis',
                })}
                className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow
                 ${
                   errors.tableNumber
                     ? 'border-red-500 dark:border-red-500'
                     : ''
                 }
               `}
                placeholder="Mettez 0 s'il n'y a pas des tables numérotées"
              />
              {errors.tableNumber && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.tableNumber.message}
                </p>
              )}
            </div>
          ) : (
            <div>
              {/* Delivery Zone Selection */}
              {settings?.delivery.enabled && (
                <>
                  <DeliveryZoneSelect
                    selectedZone={deliveryZone}
                    onZoneChange={setDeliveryZone}
                    className="mb-4"
                  />

                  {/* Delivery Fee Display */}
                  {deliveryZone && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-2">
                      <p className="text-sm text-blue-600 dark:text-blue-400 flex justify-between">
                        <span>Frais de livraison:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            deliveryZone.price,
                            settings?.currency
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                </>
              )}

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adresse de livraison *
              </label>
              <textarea
                {...register('address', {
                  required: "L'adresse de livraison est requise",
                })}
                rows={3}
                className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow resize-none
                 ${errors.address ? 'border-red-500 dark:border-red-500' : ''}
               `}
                placeholder="Votre adresse complète"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.address.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vos indications pour le restaurant (Optionnel)
          </label>
          <textarea
            {...register('preference')}
            rows={3}
            className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow resize-none `}
            placeholder="Indiquer nous ici vos préférences (exemple: pas de piment...), n'hésiter pas de marquer si vous avez des allergies ou autre chose..."
          />
        </div>

        <AnimatePresence>
          {rateLimitError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-800"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm text-red-600 dark:text-red-400">
                  {rateLimitError}
                </div>
                <button
                  // onClick={() => setRateLimitError(null)}
                  className="text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="px-4"
          >
            Retour
          </Button>
          <Button
            disabled={
              !deliveryZone &&
              diningOption === 'delivery' &&
              settings?.delivery.enabled
            }
            type="submit"
            className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Suivant
          </Button>
        </div>
      </form>
    </div>
  );
}
