import { Router, Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService.js';

const router = Router();

/**
 * POST /rooms/:roomId/bookings
 * Create a new booking for a room
 */
router.post(
  '/rooms/:roomId/bookings',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomId } = req.params;
      const booking = bookingService.createBooking(roomId, req.body);

      res.status(201).json({
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /rooms/:roomId/bookings
 * List all bookings for a room
 */
router.get(
  '/rooms/:roomId/bookings',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomId } = req.params;
      const bookings = bookingService.getBookingsByRoom(roomId);

      res.status(200).json({
        data: bookings,
        count: bookings.length,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /bookings/:bookingId
 * Cancel a booking
 */
router.delete(
  '/bookings/:bookingId',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookingId } = req.params;
      bookingService.cancelBooking(bookingId);

      res.status(200).json({
        message: 'Booking cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as bookingRoutes };
