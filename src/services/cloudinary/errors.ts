export class CloudinaryError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'CloudinaryError';
  }
}