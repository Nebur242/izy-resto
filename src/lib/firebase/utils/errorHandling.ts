export class FirebaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public operation: string
  ) {
    super(message);
    this.name = 'FirebaseError';
  }
}

export function handleFirebaseError(error: unknown, operation: string): never {
  console.error(`Firebase operation failed: ${operation}`, error);
  
  if (error instanceof FirebaseError) {
    throw error;
  }
  
  throw new FirebaseError(
    'An unexpected error occurred',
    'unknown',
    operation
  );
}