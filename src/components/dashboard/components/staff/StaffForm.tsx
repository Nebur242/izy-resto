import { useForm } from 'react-hook-form';
import { X, User, Mail, Lock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../ui/Button';
import { StaffFormData, StaffMember } from '../../../../types/staff';

interface StaffFormProps {
  staff?: StaffMember | null;
  onSave: (data: StaffFormData) => Promise<void>;
  onCancel: () => void;
}

export function StaffForm({ staff, onSave, onCancel }: StaffFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StaffFormData>({
    defaultValues: staff ? {
      name: staff.name,
      email: staff.email,
      role: staff.role,
    } : {
      role: 'staff',
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {staff ? 'Modifier le membre' : 'Nouveau membre du personnel'}
          </h2>
          <button onClick={onCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom complet
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                {...register('name', { 
                  required: 'Le nom est requis',
                  minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                {...register('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide'
                  }
                })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                placeholder="john@example.com"
                disabled={!!staff}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field - Only for new staff */}
          {!staff && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  {...register('password', { 
                    required: 'Le mot de passe est requis',
                    minLength: { value: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                  })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Rôle
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                {...register('role')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 appearance-none"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : staff ? 'Mettre à jour' : 'Créer le compte'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}