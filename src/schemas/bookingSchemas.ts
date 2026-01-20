import { z } from 'zod'

/**
 * ISO-8601 datetime string that parses to a valid Date
 */
const isoDateTimeSchema = z
  .string()
  .refine((val) => !isNaN(new Date(val).getTime()), {
    message: 'Must be a valid ISO-8601 datetime',
  })

/**
 * Schema for creating a booking (POST /rooms/:roomId/bookings body)
 * Validates:
 * - startTime and endTime are valid ISO-8601 strings
 * - startTime is before endTime
 *
 * Note: Past-booking validation is done in the service layer
 * where the Clock abstraction can be injected for testing
 */
export const createBookingBodySchema = z
  .object({
    startTime: isoDateTimeSchema,
    endTime: isoDateTimeSchema,
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: 'startTime must be before endTime',
    path: ['startTime'],
  })

/**
 * Schema for room ID URL parameter
 */
export const roomIdParamsSchema = z.object({
  roomId: z.string().min(1, 'roomId is required'),
})

/**
 * Schema for booking ID URL parameter
 */
export const bookingIdParamsSchema = z.object({
  bookingId: z.string().min(1, 'bookingId is required'),
})

// Infer TypeScript types directly from schemas
export type CreateBookingBody = z.infer<typeof createBookingBodySchema>
export type RoomIdParams = z.infer<typeof roomIdParamsSchema>
export type BookingIdParams = z.infer<typeof bookingIdParamsSchema>
