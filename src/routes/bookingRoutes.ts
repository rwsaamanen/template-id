import { Router, Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { bookingService } from '../services/bookingService.js'
import { BookingService } from '../types/index.js'

/**
 * Factory function for creating booking routes
 * Allows dependency injection of the service for testing and flexibility
 */
export function createBookingRoutes(service: BookingService): Router {
  const router = Router()

  /**
   * POST /rooms/:roomId/bookings
   * Create a new booking for a room
   */
  router.post(
    '/rooms/:roomId/bookings',
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const { roomId } = req.params
        const booking = service.createBooking(roomId, req.body)

        res.status(StatusCodes.CREATED).json({
          data: booking,
        })
      } catch (error) {
        next(error)
      }
    }
  )

  /**
   * GET /rooms/:roomId/bookings
   * List all bookings for a room
   */
  router.get(
    '/rooms/:roomId/bookings',
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const { roomId } = req.params
        const bookings = service.getBookingsByRoom(roomId)

        res.status(StatusCodes.OK).json({
          data: bookings,
          count: bookings.length,
        })
      } catch (error) {
        next(error)
      }
    }
  )

  /**
   * DELETE /bookings/:bookingId
   * Cancel a booking
   */
  router.delete(
    '/bookings/:bookingId',
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const { bookingId } = req.params
        service.cancelBooking(bookingId)

        res.status(StatusCodes.OK).json({
          message: 'Booking cancelled successfully',
        })
      } catch (error) {
        next(error)
      }
    }
  )

  return router
}

// Backward-compatible singleton export using default service
export const bookingRoutes = createBookingRoutes(bookingService)
