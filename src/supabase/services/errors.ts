
export class SupabaseServiceError extends Error {
  constructor(message: string, public readonly details?: any) {
    super(message);
    this.name = 'SupabaseServiceError';
  }
}

export class NotFoundError extends SupabaseServiceError {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends SupabaseServiceError {
  constructor(message: string, public validationErrors?: Record<string, string>) {
    super(message, validationErrors);
    this.name = 'ValidationError';
  }
}
