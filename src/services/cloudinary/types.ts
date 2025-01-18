export interface UploadProgressCallback {
  (progress: number): void;
}

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export interface CloudinaryError {
  error?: {
    message: string;
  };
}

export interface DeleteResponse {
  result: 'ok' | 'error';
  error?: {
    message: string;
  };
}