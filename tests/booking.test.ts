import { describe, it, expect, beforeEach } from 'vitest'

import { bookingService } from '../src/services/bookingService.js'
import { bookingStore } from '../src/storage/bookingStore.js'
import { AppError } from '../src/types/index.js'
import { validateCreateBooking } from '../src/validators/bookingValidator.js'

describe('Booking Validator', () => {
  // Use a fixed "now" time for testing
  const now = new Date('2026-01-20T12:00:00Z')

  describe('validateCreateBooking', () => {
    it('should accept valid booking request', () => {
      const body = {
        startTime: '2026-01-21T10:00:00Z',
        endTime: '2026-01-21T11:00:00Z',
      }

      const result = validateCreateBooking(body, now)

      expect(result.startTime).toBeInstanceOf(Date)
      expect(result.endTime).toBeInstanceOf(Date)
    })

    it('should reject missing startTime', () => {
      const body = { endTime: '2026-01-21T11:00:00Z' }

      expect(() => validateCreateBooking(body, now)).toThrow(AppError)
      expect(() => validateCreateBooking(body, now)).toThrow(
        'startTime is required'
      )
    })

    it('should reject missing endTime', () => {
      const body = { startTime: '2026-01-21T10:00:00Z' }

      expect(() => validateCreateBooking(body, now)).toThrow(AppError)
      expect(() => validateCreateBooking(body, now)).toThrow(
        'endTime is required'
      )
    })

    it('should reject invalid date format', () => {
      const body = {
        startTime: 'not-a-date',
        endTime: '2026-01-21T11:00:00Z',
      }

      expect(() => validateCreateBooking(body, now)).toThrow(AppError)
      expect(() => validateCreateBooking(body, now)).toThrow(
        'valid ISO-8601 date'
      )
    })

    it('should reject when startTime equals endTime', () => {
      const body = {
        startTime: '2026-01-21T10:00:00Z',
        endTime: '2026-01-21T10:00:00Z',
      }

      expect(() => validateCreateBooking(body, now)).toThrow(AppError)
      expect(() => validateCreateBooking(body, now)).toThrow(
        'startTime must be before endTime'
      )
    })

    it('should reject when startTime is after endTime', () => {
      const body = {
        startTime: '2026-01-21T12:00:00Z',
        endTime: '2026-01-21T10:00:00Z',
      }

      expect(() => validateCreateBooking(body, now)).toThrow(AppError)
      expect(() => validateCreateBooking(body, now)).toThrow(
        'startTime must be before endTime'
      )
    })

    it('should reject bookings in the past', () => {
      const body = {
        startTime: '2026-01-19T10:00:00Z', // Before "now"
        endTime: '2026-01-19T11:00:00Z',
      }

      expect(() => validateCreateBooking(body, now)).toThrow(AppError)
      expect(() => validateCreateBooking(body, now)).toThrow(
        'Cannot create bookings in the past'
      )
    })

    it('should reject non-object body', () => {
      expect(() => validateCreateBooking(null, now)).toThrow(
        'must be a JSON object'
      )
      expect(() => validateCreateBooking('string', now)).toThrow(
        'must be a JSON object'
      )
    })
  })
})

describe('Booking Store', () => {
  beforeEach(() => {
    bookingStore.clear()
  })

  it('should create and retrieve a booking', () => {
    const booking = {
      id: 'test-1',
      roomId: 'room-a',
      startTime: '2026-01-21T10:00:00Z',
      endTime: '2026-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    }

    bookingStore.create(booking)

    expect(bookingStore.findById('test-1')).toEqual(booking)
  })

  it('should find bookings by room', () => {
    bookingStore.create({
      id: 'test-1',
      roomId: 'room-a',
      startTime: '2026-01-21T10:00:00Z',
      endTime: '2026-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })
    bookingStore.create({
      id: 'test-2',
      roomId: 'room-b',
      startTime: '2026-01-21T10:00:00Z',
      endTime: '2026-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })
    bookingStore.create({
      id: 'test-3',
      roomId: 'room-a',
      startTime: '2026-01-21T14:00:00Z',
      endTime: '2026-01-21T15:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })

    const roomABookings = bookingStore.findByRoom('room-a')

    expect(roomABookings).toHaveLength(2)
    expect(roomABookings.map((b) => b.id)).toEqual(['test-1', 'test-3'])
  })

  it('should delete a booking', () => {
    bookingStore.create({
      id: 'test-1',
      roomId: 'room-a',
      startTime: '2026-01-21T10:00:00Z',
      endTime: '2026-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })

    const deleted = bookingStore.delete('test-1')

    expect(deleted).toBe(true)
    expect(bookingStore.findById('test-1')).toBeUndefined()
  })

  it('should return false when deleting non-existent booking', () => {
    const deleted = bookingStore.delete('non-existent')
    expect(deleted).toBe(false)
  })
})

describe('Booking Service - Overlap Detection', () => {
  beforeEach(() => {
    bookingStore.clear()
  })

  it('should allow non-overlapping bookings', () => {
    // First booking: 10:00 - 11:00
    const booking1 = bookingService.createBooking('room-a', {
      startTime: '2026-01-21T10:00:00Z',
      endTime: '2026-01-21T11:00:00Z',
    })

    // Second booking: 11:00 - 12:00 (starts exactly when first ends)
    const booking2 = bookingService.createBooking('room-a', {
      startTime: '2026-01-21T11:00:00Z',
      endTime: '2026-01-21T12:00:00Z',
    })

    expect(booking1.id).toBeDefined()
    expect(booking2.id).toBeDefined()
    expect(bookingStore.findByRoom('room-a')).toHaveLength(2)
  })

  it('should reject overlapping bookings (new starts during existing)', () => {
    // First booking: 10:00 - 12:00
    bookingService.createBooking('room-a', {
      startTime: '2026-01-21T10:00:00Z',
      endTime: '2026-01-21T12:00:00Z',
    })

    // Second booking: 11:00 - 13:00 (starts during first)
    expect(() =>
      bookingService.createBooking('room-a', {
        startTime: '2026-01-21T11:00:00Z',
        endTime: '2026-01-21T13:00:00Z',
      })
    ).toThrow('overlaps')
  })

  it('should reject overlapping bookings (new contains existing)', () => {
    // First booking: 11:00 - 12:00
    bookingService.createBooking('room-a', {
      startTime: '2026-01-21T11:00:00Z',
      endTime: '2026-01-21T12:00:00Z',
    })

    // Second booking: 10:00 - 13:00 (contains first)
    expect(() =>
      bookingService.createBooking('room-a', {
        startTime: '2026-01-21T10:00:00Z',
        endTime: '2026-01-21T13:00:00Z',
      })
    ).toThrow('overlaps')
  })

  it('should reject overlapping bookings (new inside existing)', () => {
    // First booking: 10:00 - 14:00
    bookingService.createBooking('room-a', {
      startTime: '2026-01-21T10:00:00Z',
      endTime: '2026-01-21T14:00:00Z',
    })

    // Second booking: 11:00 - 12:00 (inside first)
    expect(() =>
      bookingService.createBooking('room-a', {
        startTime: '2026-01-21T11:00:00Z',
        endTime: '2026-01-21T12:00:00Z',
      })
    ).toThrow('overlaps')
  })

  it('should allow same time slot in different rooms', () => {
    const booking1 = bookingService.createBooking('room-a', {
      startTime: '2026-01-21T10:00:00Z',
      endTime: '2026-01-21T11:00:00Z',
    })

    const booking2 = bookingService.createBooking('room-b', {
      startTime: '2026-01-21T10:00:00Z',
      endTime: '2026-01-21T11:00:00Z',
    })

    expect(booking1.roomId).toBe('room-a')
    expect(booking2.roomId).toBe('room-b')
  })

  it('should throw 404 when cancelling non-existent booking', () => {
    expect(() => bookingService.cancelBooking('non-existent')).toThrow(AppError)
    expect(() => bookingService.cancelBooking('non-existent')).toThrow(
      'not found'
    )
  })
})
