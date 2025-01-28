import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ProgressBar } from '../../../ui/ProgressBar';

interface MediaUploaderProps {
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
}

export function MediaUploader({ 
  onClose, 
  onUpload,
  maxSizeMB = 5,
  acceptedFileTypes = ['.png', '.jpg', '.jpeg', '.gif']
}: MediaUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const isUploading = uploadProgress !== null;
  const isComplete = uploadProgress === 100;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        setUploadProgress(0);
        await onUpload(file);
        setUploadProgress(100);
        // Wait a moment to show the completion state before closing
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadProgress(null);
      }
    }
  }, [onUpload, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedFileTypes
    },
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        <button
          onClick={onClose}
          disabled={isUploading && !isComplete}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Ajouter un média
        </h2>

        <div
          {...getRootProps()}
          className={`
            relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8
            transition-all
            ${isDragActive
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
              : isComplete
              ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
            }
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="w-full space-y-4">
              <div className="flex justify-between text-sm">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isComplete ? 'complete' : 'uploading'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-gray-900 dark:text-gray-100 font-medium"
                  >
                    {isComplete ? 'Téléchargement terminé!' : "Ajout d'image en cours..."}
                  </motion.span>
                </AnimatePresence>
                <span className="text-gray-600 dark:text-gray-300">{uploadProgress}%</span>
              </div>
              <ProgressBar 
                progress={uploadProgress || 0} 
                isComplete={isComplete} 
              />
              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center text-green-600 dark:text-green-400"
                >
                  <Check className="h-6 w-6 mr-2" />
                  <span className="text-gray-900 dark:text-gray-100">Téléchargement terminé!</span>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <Upload className={`h-12 w-12 mb-4 ${
                isDragActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400'
              }`} />
              
              <p className="text-center text-gray-900 dark:text-gray-100">
                {isDragActive ? (
                  'Déposez le fichier ici...'
                ) : (
                  <>
                    Glissez et déposez un fichier ici, ou<br />
                    <span className="text-blue-500 dark:text-blue-400">
                      cliquez pour sélectionner
                    </span>
                  </>
                )}
              </p>
              
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF jusqu'à {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}