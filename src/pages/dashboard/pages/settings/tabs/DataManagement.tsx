import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Database,
  Trash2,
  RefreshCw,
  Loader2,
  FolderOpen,
  AlertTriangleIcon,
} from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';
import { ConfirmDialog } from '../../../../../components/ui/ConfirmDialog';
import { cloudinaryService } from '../../../../../services/cloudinary/cloudinary.service';
import { db } from '../../../../../lib/firebase/config';
import { collection, getDocs, writeBatch, query } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface CollectionData {
  name: string;
  count: number;
}

export function DataManagement() {
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    collection?: string;
    itemCount?: number;
  }>({ isOpen: false });
  const [resetConfirmation, setResetConfirmation] = useState(false);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const collectionsToCheck = [
        'categories',
        'menu_items',
        'orders',
        'inventory',
        'stock_history',
        'media',
        'variants',
        'transactions',
        'payment_methods',
        'staff',
        'settings',
      ];

      const collectionsData = await Promise.all(
        collectionsToCheck.map(async name => {
          const snapshot = await getDocs(collection(db, name));
          return {
            name,
            count: snapshot.size,
          };
        })
      );

      setCollections(collectionsData);
    } catch (error) {
      console.error('Error loading collections:', error);
      toast.error('Erreur lors du chargement des collections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCollection = async () => {
    if (!deleteConfirmation.collection) return;
    const collectionName = deleteConfirmation.collection;

    try {
      setIsDeleting(collectionName);

      // Special handling for media collection
      if (collectionName === 'media') {
        const snapshot = await getDocs(collection(db, 'media'));
        const mediaFiles = snapshot.docs.map(doc => doc.data());

        // Delete files from Cloudinary
        for (const file of mediaFiles) {
          try {
            const publicId = file.url.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinaryService.deleteFile(publicId);
            }
          } catch (error) {
            console.error('Error deleting file from Cloudinary:', error);
          }
        }
      }

      // Delete all documents in the collection
      const snapshot = await getDocs(collection(db, collectionName));
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Refresh collections data
      await loadCollections();
      toast.success(`Collection ${collectionName} supprimée avec succès`);
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(null);
      setDeleteConfirmation({ isOpen: false });
    }
  };

  const handleResetWebsite = async () => {
    try {
      setIsResetting(true);

      // Delete all collections
      for (const { name } of collections) {
        if (name === 'settings') continue; // Skip settings collection

        if (name === 'payment_methods') continue;

        // Special handling for media collection
        if (name === 'media') {
          const snapshot = await getDocs(collection(db, 'media'));
          const mediaFiles = snapshot.docs.map(doc => doc.data());

          for (const file of mediaFiles) {
            try {
              const publicId = file.url.split('/').pop()?.split('.')[0];
              if (publicId) {
                await cloudinaryService.deleteFile(publicId);
              }
            } catch (error) {
              console.error('Error deleting file from Cloudinary:', error);
            }
          }
        }

        // Delete collection documents
        const snapshot = await getDocs(collection(db, name));
        const batch = writeBatch(db);
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        const hasAcceptedCookies = localStorage.getItem('cookiesAccepted')
          ? localStorage.getItem('cookiesAccepted') === 'true'
          : false;

        await batch.commit();
        localStorage.clear();

        if (hasAcceptedCookies) {
          localStorage.setItem('cookiesAccepted', `${hasAcceptedCookies}`);
        }
      }

      await loadCollections();
      toast.success('Site réinitialisé avec succès');
    } catch (error) {
      console.error('Error resetting website:', error);
      toast.error('Erreur lors de la réinitialisation');
    } finally {
      setIsResetting(false);
      setResetConfirmation(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Collections Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold">Collections Firebase</h2>
          <span className="flex gap-2 text-red-800 dark:text-red-400">
            <AlertTriangleIcon /> A utiliser avec précaution
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {collections
            .filter(({ name }) => name !== 'payment_methods')
            .map(({ name, count }) => (
              <motion.div
                key={name}
                layout
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">{name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {count} document{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {name !== 'settings' && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      setDeleteConfirmation({
                        isOpen: true,
                        collection: name,
                        itemCount: count,
                      })
                    }
                    disabled={isDeleting === name}
                    className="flex-shrink-0"
                  >
                    {isDeleting === name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </motion.div>
            ))}
        </div>
      </section>

      {/* Reset Website Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h2 className="text-xl font-semibold">Zone Dangereuse</h2>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-4">
            Réinitialiser le Site
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-6">
            Cette action supprimera définitivement toutes les données du site, y
            compris les catégories, les produits, les commandes et les médias.
            Cette action est irréversible.
          </p>
          <Button
            variant="danger"
            onClick={() => setResetConfirmation(true)}
            disabled={isResetting}
            className="w-full sm:w-auto"
          >
            {isResetting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Réinitialisation...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser le Site
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        title={`Supprimer la collection ${deleteConfirmation.collection}`}
        message={`Êtes-vous sûr de vouloir supprimer la collection "${
          deleteConfirmation.collection
        }" ? 
                Cette action supprimera ${
                  deleteConfirmation.itemCount
                } document${deleteConfirmation.itemCount !== 1 ? 's' : ''} 
                et est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={handleDeleteCollection}
        onCancel={() => setDeleteConfirmation({ isOpen: false })}
        isLoading={isDeleting === deleteConfirmation.collection}
      />

      <ConfirmDialog
        isOpen={resetConfirmation}
        title="Réinitialiser le site"
        message="Êtes-vous sûr de vouloir réinitialiser le site ? Cette action supprimera toutes les données 
                et est irréversible. Les paramètres du site seront conservés."
        confirmLabel="Réinitialiser"
        onConfirm={handleResetWebsite}
        onCancel={() => setResetConfirmation(false)}
        isLoading={isResetting}
      />
    </div>
  );
}
