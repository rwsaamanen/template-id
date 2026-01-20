import { v4 as uuidv4 } from 'uuid'

import {
  createBookingBodySchema,
  roomIdParamsSchema,
  bookingIdParamsSchema,
} from '../schemas/bookingSchemas.js'
import { bookingStore } from '../storage/bookingStore.js'
import {
  Booking,
  BookingRepository,
  BookingService,
  AppError,
  ErrorCodes,
} from '../types/index.js'
import { Clock, realClock } from '../utils/clock.js'
import { decode } from '../utils/validation.js'

/**
 * Factory function for creating booking service instances
 * Allows dependency injection of the repository and clock for testing
 */
export function createBookingService(
  repository: BookingRepository,
  clock: Clock = realClock
): BookingService {
  /**
   * Check if a new booking would overlap with existing bookings for the same room
   * Two time ranges overlap if: newStart < existingEnd AND newEnd > existingStart
   * @throws AppError if overlap is detected
   */
  function checkForOverlap(roomId: string, newStart: Date, newEnd: Date): void {
    const existingBookings = repository.findByRoom(roomId)

    for (const existing of existingBookings) {
      const existingStart = new Date(existing.startTime)
      const existingEnd = new Date(existing.endTime)

      const overlaps =
        newStart.getTime() < existingEnd.getTime() &&
        newEnd.getTime() > existingStart.getTime()

      if (overlaps) {
        throw new AppError(
          409,
          ErrorCodes.BOOKING_OVERLAP,
          `The requested time slot overlaps with an existing booking (${existing.startTime} - ${existing.endTime})`
        )
      }
    }
  }

  return {
    /**
     * Create a new booking for a room
     * @throws AppError if validation fails or booking overlaps
     */
    createBooking(roomId: string, body: unknown): Booking {
      // Validate inputs using Zod
      decode('roomIdParams', roomIdParamsSchema, { roomId })
      const validated = decode(
        'createBookingBody',
        createBookingBodySchema,
        body
      )

      const startTime = new Date(validated.startTime)
      const endTime = new Date(validated.endTime)

      // Check if booking is in the past (using injected clock)
      if (startTime <= clock.now()) {
        throw new AppError(
          400,
          ErrorCodes.VALIDATION_ERROR,
          'Cannot create bookings in the past'
        )
      }

      // Check for overlapping bookings
      checkForOverlap(roomId, startTime, endTime)

      // Create the booking
      const booking: Booking = {
        id: uuidv4(),
        roomId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        createdAt: clock.now().toISOString(),
      }

      return repository.create(booking)
    },

    /**
     * Get all bookings for a room
     */
    getBookingsByRoom(roomId: string): Booking[] {
      decode('roomIdParams', roomIdParamsSchema, { roomId })
      return repository.findByRoom(roomId)
    },

    /**
     * Cancel (delete) a booking by ID
     * @throws AppError if booking not found
     */
    cancelBooking(bookingId: string): void {
      decode('bookingIdParams', bookingIdParamsSchema, { bookingId })

      const booking = repository.findById(bookingId)
      if (!booking) {
        throw new AppError(
          404,
          ErrorCodes.BOOKING_NOT_FOUND,
          `Booking with id '${bookingId}' not found`
        )
      }

      repository.delete(bookingId)
    },

    /**
     * Get a single booking by ID (useful for testing)
     */
    getBookingById(bookingId: string): Booking | undefined {
      decode('bookingIdParams', bookingIdParamsSchema, { bookingId })
      return repository.findById(bookingId)
    },
  }
}

// Backward-compatible singleton export using default repository and clock
export const bookingService = createBookingService(bookingStore, realClock)
