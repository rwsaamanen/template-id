import { Request, Response, NextFunction } from 'express'

import { AppError, ErrorCodes, ApiError } from '../types/index.js'

/**
 * Centralized error handling middleware
 * Converts errors to consistent JSON responses
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error for debugging (in production, use a proper logger)
  console.error(`[ERROR] ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack,
  })

  // Handle known application errors
  if (err instanceof AppError) {
    const response: { error: ApiError } = {
      error: {
        code: err.code,
        message: err.message,
        ...(err.errors && { errors: err.errors }),
      },
    }
    res.status(err.statusCode).json(response)
    return
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && 'body' in err) {
    const response: { error: ApiError } = {
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Invalid JSON in request body',
      },
    }
    res.status(400).json(response)
    return
  }

  // Handle unknown errors
  const response: { error: ApiError } = {
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
    },
  }
  res.status(500).json(response)
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  })
}
