import { Booking } from '../types/index.js'

/**
 * In-memory storage for bookings using a Map for O(1) lookup by ID
 */
class BookingStore {
  private bookings: Map<string, Booking> = new Map()

  /**
   * Create a new booking
   */
  create(booking: Booking): Booking {
    this.bookings.set(booking.id, booking)
    return booking
  }

  /**
   * Find a booking by ID
   */
  findById(id: string): Booking | undefined {
    return this.bookings.get(id)
  }

  /**
   * Find all bookings for a specific room
   */
  findByRoom(roomId: string): Booking[] {
    const roomBookings: Booking[] = []
    for (const booking of this.bookings.values()) {
      if (booking.roomId === roomId) {
        roomBookings.push(booking)
      }
    }
    // Sort by start time for consistent ordering
    return roomBookings.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
  }

  /**
   * Delete a booking by ID
   * @returns true if booking was deleted, false if not found
   */
  delete(id: string): boolean {
    return this.bookings.delete(id)
  }

  /**
   * Get all bookings (useful for testing)
   */
  getAll(): Booking[] {
    return Array.from(this.bookings.values())
  }

  /**
   * Clear all bookings (useful for testing)
   */
  clear(): void {
    this.bookings.clear()
  }
}

// Export a singleton instance
export const bookingStore = new BookingStore()
