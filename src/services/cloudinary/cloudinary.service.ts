import { cloudinaryConfig } from '../../config/api.config';
import { validateUploadFile, validateCloudinaryResponse } from './validators';
import type { UploadProgressCallback, CloudinaryResponse, DeleteResponse } from './types';
import { CloudinaryError } from './errors';

class CloudinaryService {
  private readonly CLOUD_NAME = cloudinaryConfig.cloudName;
  private readonly UPLOAD_PRESET = cloudinaryConfig.uploadPreset;
  private readonly API_KEY = cloudinaryConfig.apiKey;
  private readonly API_SECRET = cloudinaryConfig.apiSecret;

  async uploadFile(file: File, onProgress?: UploadProgressCallback): Promise<string> {
    try {
      // Validate file before upload
      validateUploadFile(file);
      onProgress?.(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.UPLOAD_PRESET);
      formData.append('folder', 'restaurant');

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Handle upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.min(98, Math.round((event.loaded / event.total) * 100));
            onProgress(progress);
          }
        };

        // Handle response
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText) as CloudinaryResponse;
              validateCloudinaryResponse(response);
              onProgress?.(100);
              resolve(response.secure_url);
            } catch (error) {
              reject(new CloudinaryError('Invalid response format', 'INVALID_RESPONSE'));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new CloudinaryError(
                error.error?.message || 'Upload failed',
                'UPLOAD_FAILED'
              ));
            } catch {
              reject(new CloudinaryError(
                `Upload failed with status: ${xhr.status}`,
                'UPLOAD_FAILED'
              ));
            }
          }
        };

        // Handle errors
        xhr.onerror = () => reject(new CloudinaryError('Network error during upload', 'NETWORK_ERROR'));
        xhr.onabort = () => reject(new CloudinaryError('Upload was aborted', 'UPLOAD_ABORTED'));
        xhr.ontimeout = () => reject(new CloudinaryError('Upload timed out', 'TIMEOUT'));

        // Send request
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`);
        xhr.timeout = 30000; // 30 second timeout
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Upload error:', error);
      onProgress?.(0);
      throw error;
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      const timestamp = Math.round((new Date()).getTime() / 1000);
      const signature = await this.generateSignature(publicId, timestamp);

      const formData = new FormData();
      formData.append('public_id', `restaurant/${publicId}`);
      formData.append('api_key', this.API_KEY);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/destroy`,
        { 
          method: 'POST', 
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new CloudinaryError(
          `Delete failed with status: ${response.status}`,
          'DELETE_FAILED'
        );
      }

      const result = await response.json() as DeleteResponse;
      if (result.result !== 'ok') {
        throw new CloudinaryError(
          result.error?.message || 'Delete failed',
          'DELETE_FAILED'
        );
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error instanceof CloudinaryError ? error : new CloudinaryError(
        'Failed to delete file',
        'DELETE_FAILED'
      );
    }
  }

  private async generateSignature(publicId: string, timestamp: number): Promise<string> {
    try {
      const str = `public_id=restaurant/${publicId}&timestamp=${timestamp}${this.API_SECRET}`;
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Signature generation error:', error);
      throw new CloudinaryError('Failed to generate signature', 'SIGNATURE_ERROR');
    }
  }
}

export const cloudinaryService = new CloudinaryService();