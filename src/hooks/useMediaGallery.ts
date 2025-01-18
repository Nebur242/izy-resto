import { useState, useEffect } from 'react';
import { mediaService } from '../services/media/media.service';
import { MediaFile } from '../types/media';
import toast from 'react-hot-toast';

export function useMediaGallery(itemsPerPage: number = 12) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const mediaFiles = await mediaService.getAllMedia();
      setFiles(mediaFiles);
    } catch (error) {
      console.error('Error loading media files:', error);
      toast.error('Erreur chargement gallerie');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFiles = async (files: File[]) => {
    try {
      const uploadPromises = files.map(file => {
        return mediaService.uploadFile(file, (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        });
      });

      await Promise.all(uploadPromises);
      await loadFiles(); // Reload files after upload
      setCurrentPage(1); // Reset to first page
      setUploadProgress({}); // Clear progress

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({});
      throw error;
    }
  };

  const deleteFiles = async (fileIds: string[]) => {
    try {
      await mediaService.deleteFiles(fileIds);
      await loadFiles(); // Reload files after deletion
      
      // Update current page if needed
      const newTotalPages = Math.ceil((files.length - fileIds.length) / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const totalPages = Math.ceil(files.length / itemsPerPage);
  const paginatedFiles = files.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    files: paginatedFiles,
    totalFiles: files.length,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoading,
    uploadFiles,
    deleteFiles,
    uploadProgress,
    refreshFiles: loadFiles
  };
}