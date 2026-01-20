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
 * Repository interface for booking storage
 * Allows swapping implementations (in-memory, database, etc.)
 */
export interface BookingRepository {
  create(booking: Booking): Booking
  findById(id: string): Booking | undefined
  findByRoom(roomId: string): Booking[]
  delete(id: string): boolean
  getAll(): Booking[]
  clear(): void
}

/**
 * Service interface for booking operations
 */
export interface BookingService {
  createBooking(roomId: string, body: unknown): Booking
  getBookingsByRoom(roomId: string): Booking[]
  cancelBooking(bookingId: string): void
  getBookingById(bookingId: string): Booking | undefined
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
  NOT_FOUND: 'NOT_FOUND',
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  PAST_BOOKING: 'PAST_BOOKING',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]
