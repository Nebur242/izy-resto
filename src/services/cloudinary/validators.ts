export function validateUploadFile(file: File): void {
  if (!file) {
    throw new Error('No file provided');
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }
}

export function validateCloudinaryResponse(response: any): void {
  if (!response?.secure_url) {
    throw new Error('Invalid response from Cloudinary');
  }
}