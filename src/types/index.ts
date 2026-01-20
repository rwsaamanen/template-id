/**
 * Represents a room booking
 */
export interface Booking {
  id: string
  roomId: string
  startTime: string // ISO-8601 format
  endTime: string // ISO-8601 format
  createdAt: string // ISO-8601 format
}

/**
 * Standardized API error response
 */
export interface ApiError {
  code: string
  message: string
  errors?: unknown[] // Optional validation error details
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly errors?: unknown[] // Optional validation error details
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Error codes used throughout the application
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BOOKING_OVERLAP: 'BOOKING_OVERLAP',
  BOOKING_NOT_FOUND: 'BOOKING_NOT_FOUND',
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  PAST_BOOKING: 'PAST_BOOKING',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]
