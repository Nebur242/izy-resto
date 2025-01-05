import { CheckCircle2 } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center animate-in slide-in-from-bottom duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 dark:bg-green-900 rounded-full">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Paiement Réussi !
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Votre transaction a été traitée avec succès. Un email de confirmation
          vous sera envoyé dans quelques minutes.
        </p>

        <nav className="space-y-4">
          <p className="block w-full px-8 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
            Merci de retourner sur la page où la commande a été effectuée.
          </p>
        </nav>
      </div>
    </main>
  );
}
