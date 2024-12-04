export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(
      `Database operation failed: ${message}`,
      500,
      'DATABASE_ERROR'
    );
    this.name = 'DatabaseError';
    this.cause = originalError;
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      status: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      error: 'Internal Server Error',
      message: error.message,
      status: 500,
    };
  }

  return {
    error: 'Unknown Error',
    message: String(error),
    status: 500,
  };
}
