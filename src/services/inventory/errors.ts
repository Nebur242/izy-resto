export class StockUpdateError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'StockUpdateError';
  }
}