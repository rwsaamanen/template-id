import { v4 as uuidv4 } from 'uuid'

import {
  createBookingBodySchema,
  roomIdParamsSchema,
  bookingIdParamsSchema,
} from '../schemas/bookingSchemas.js'
import { bookingStore } from '../storage/bookingStore.js'
import { Booking, AppError, ErrorCodes } from '../types/index.js'
import { decode } from '../utils/validation.js'

/**
 * Service layer for booking operations
 * Enforces business rules and coordinates between validation and storage
 */
export const bookingService = {
  /**
   * Create a new booking for a room
   * @throws AppError if validation fails or booking overlaps
   */
  createBooking(roomId: string, body: unknown): Booking {
    // Validate inputs using Zod
    decode('roomIdParams', roomIdParamsSchema, { roomId })
    const validated = decode('createBookingBody', createBookingBodySchema, body)

    const startTime = new Date(validated.startTime)
    const endTime = new Date(validated.endTime)

    // Check for overlapping bookings
    checkForOverlap(roomId, startTime, endTime)

    // Create the booking
    const booking: Booking = {
      id: uuidv4(),
      roomId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      createdAt: new Date().toISOString(),
    }

    return bookingStore.create(booking)
  },

  /**
   * Get all bookings for a room
   */
  getBookingsByRoom(roomId: string): Booking[] {
    decode('roomIdParams', roomIdParamsSchema, { roomId })
    return bookingStore.findByRoom(roomId)
  },

  /**
   * Cancel (delete) a booking by ID
   * @throws AppError if booking not found
   */
  cancelBooking(bookingId: string): void {
    decode('bookingIdParams', bookingIdParamsSchema, { bookingId })

    const booking = bookingStore.findById(bookingId)
    if (!booking) {
      throw new AppError(
        404,
        ErrorCodes.BOOKING_NOT_FOUND,
        `Booking with id '${bookingId}' not found`
      )
    }

    bookingStore.delete(bookingId)
  },

  /**
   * Get a single booking by ID (useful for testing)
   */
  getBookingById(bookingId: string): Booking | undefined {
    decode('bookingIdParams', bookingIdParamsSchema, { bookingId })
    return bookingStore.findById(bookingId)
  },
}

/**
 * Check if a new booking would overlap with existing bookings for the same room
 * Two time ranges overlap if: newStart < existingEnd AND newEnd > existingStart
 * @throws AppError if overlap is detected
 */
function checkForOverlap(roomId: string, newStart: Date, newEnd: Date): void {
  const existingBookings = bookingStore.findByRoom(roomId)

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
