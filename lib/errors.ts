export class BirrError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'BirrError';
  }
}

export class ValidationError extends BirrError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthError extends BirrError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends BirrError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class DuplicateError extends BirrError {
  constructor(resource: string) {
    super(`${resource} already exists`, 'DUPLICATE', 409);
    this.name = 'DuplicateError';
  }
}

export class ForbiddenError extends BirrError {
  constructor(message = 'Access denied') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}
