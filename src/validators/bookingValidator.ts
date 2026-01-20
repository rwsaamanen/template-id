import { AppError, ErrorCodes } from '../types/index.js'

/**
 * Result of validation containing parsed dates
 */
export interface ValidatedBooking {
  startTime: Date
  endTime: Date
}

/**
 * Validates a booking creation request
 * @throws AppError if validation fails
 */
export function validateCreateBooking(
  body: unknown,
  now: Date = new Date()
): ValidatedBooking {
  // Check if body is an object
  if (!body || typeof body !== 'object') {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      'Request body must be a JSON object'
    )
  }

  const request = body as Record<string, unknown>

  // Check required fields
  if (!request.startTime) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      'startTime is required'
    )
  }

  if (!request.endTime) {
    throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'endTime is required')
  }

  // Check field types
  if (typeof request.startTime !== 'string') {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      'startTime must be a string in ISO-8601 format'
    )
  }

  if (typeof request.endTime !== 'string') {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      'endTime must be a string in ISO-8601 format'
    )
  }

  // Parse and validate dates
  const startTime = parseISODate(request.startTime, 'startTime')
  const endTime = parseISODate(request.endTime, 'endTime')

  // Validate start is before end
  if (startTime.getTime() >= endTime.getTime()) {
    throw new AppError(
      400,
      ErrorCodes.INVALID_TIME_RANGE,
      'startTime must be before endTime'
    )
  }

  // Validate booking is not in the past
  if (startTime.getTime() < now.getTime()) {
    throw new AppError(
      400,
      ErrorCodes.PAST_BOOKING,
      'Cannot create bookings in the past'
    )
  }

  return { startTime, endTime }
}

/**
 * Parse and validate an ISO-8601 date string
 */
function parseISODate(value: string, fieldName: string): Date {
  const date = new Date(value)

  if (isNaN(date.getTime())) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      `${fieldName} must be a valid ISO-8601 date`
    )
  }

  return date
}

/**
 * Validates that a room ID is valid
 */
export function validateRoomId(roomId: string): void {
  if (!roomId || roomId.trim() === '') {
    throw new AppError(400, ErrorCodes.VALIDATION_ERROR, 'roomId is required')
  }
}

/**
 * Validates that a booking ID is valid
 */
export function validateBookingId(bookingId: string): void {
  if (!bookingId || bookingId.trim() === '') {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      'bookingId is required'
    )
  }
}
