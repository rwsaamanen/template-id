import { describe, it, expect, beforeEach } from 'vitest'

import { createBookingBodySchema } from '../src/schemas/bookingSchemas.js'
import { createBookingService } from '../src/services/bookingService.js'
import { createBookingRepository } from '../src/storage/bookingStore.js'
import {
  AppError,
  BookingRepository,
  BookingService,
} from '../src/types/index.js'
import { Clock } from '../src/utils/clock.js'
import { decode } from '../src/utils/validation.js'

describe('Zod Validation with decode()', () => {
  describe('createBookingBodySchema', () => {
    it('should accept valid booking request', () => {
      const body = {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      }

      const result = decode('createBookingBody', createBookingBodySchema, body)

      expect(result.startTime).toBe('2099-01-21T10:00:00Z')
      expect(result.endTime).toBe('2099-01-21T11:00:00Z')
    })

    it('should reject missing startTime', () => {
      const body = { endTime: '2099-01-21T11:00:00Z' }

      expect(() =>
        decode('createBookingBody', createBookingBodySchema, body)
      ).toThrow(AppError)
    })

    it('should reject missing endTime', () => {
      const body = { startTime: '2099-01-21T10:00:00Z' }

      expect(() =>
        decode('createBookingBody', createBookingBodySchema, body)
      ).toThrow(AppError)
    })

    it('should reject invalid date format', () => {
      const body = {
        startTime: 'not-a-date',
        endTime: '2099-01-21T11:00:00Z',
      }

      expect(() =>
        decode('createBookingBody', createBookingBodySchema, body)
      ).toThrow(AppError)
    })

    it('should reject when startTime equals endTime', () => {
      const body = {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T10:00:00Z',
      }

      expect(() =>
        decode('createBookingBody', createBookingBodySchema, body)
      ).toThrow(AppError)
    })

    it('should reject when startTime is after endTime', () => {
      const body = {
        startTime: '2099-01-21T12:00:00Z',
        endTime: '2099-01-21T10:00:00Z',
      }

      expect(() =>
        decode('createBookingBody', createBookingBodySchema, body)
      ).toThrow(AppError)
    })

    it('should include validation errors in AppError', () => {
      const body = { endTime: '2099-01-21T11:00:00Z' }

      try {
        decode('createBookingBody', createBookingBodySchema, body)
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        const appError = error as AppError
        expect(appError.errors).toBeDefined()
        expect(Array.isArray(appError.errors)).toBe(true)
      }
    })
  })
})

describe('Booking Repository', () => {
  let repository: BookingRepository

  beforeEach(() => {
    // Fresh repository instance for each test - no shared state
    repository = createBookingRepository()
  })

  it('should create and retrieve a booking', () => {
    const booking = {
      id: 'test-1',
      roomId: 'room-a',
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    }

    repository.create(booking)

    expect(repository.findById('test-1')).toEqual(booking)
  })

  it('should find bookings by room', () => {
    repository.create({
      id: 'test-1',
      roomId: 'room-a',
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })
    repository.create({
      id: 'test-2',
      roomId: 'room-b',
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })
    repository.create({
      id: 'test-3',
      roomId: 'room-a',
      startTime: '2099-01-21T14:00:00Z',
      endTime: '2099-01-21T15:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })

    const roomABookings = repository.findByRoom('room-a')

    expect(roomABookings).toHaveLength(2)
    expect(roomABookings.map((b) => b.id)).toEqual(['test-1', 'test-3'])
  })

  it('should delete a booking', () => {
    repository.create({
      id: 'test-1',
      roomId: 'room-a',
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })

    const deleted = repository.delete('test-1')

    expect(deleted).toBe(true)
    expect(repository.findById('test-1')).toBeUndefined()
  })

  it('should return false when deleting non-existent booking', () => {
    const deleted = repository.delete('non-existent')
    expect(deleted).toBe(false)
  })
})

describe('Booking Service', () => {
  let repository: BookingRepository
  let service: BookingService
  let mockClock: Clock

  beforeEach(() => {
    // Fresh repository and service instances for each test
    repository = createBookingRepository()
    // Mock clock set to a fixed time before the test bookings
    mockClock = { now: () => new Date('2099-01-21T09:00:00Z') }
    service = createBookingService(repository, mockClock)
  })

  describe('Clock and Time Handling', () => {
    it('should use injected clock for createdAt timestamp', () => {
      const booking = service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      })

      expect(booking.createdAt).toBe('2099-01-21T09:00:00.000Z')
    })

    it('should reject bookings in the past (relative to clock)', () => {
      // Mock clock is at 2099-01-21T09:00:00Z
      // Try to book at 08:00 (before clock time)
      expect(() =>
        service.createBooking('room-a', {
          startTime: '2099-01-21T08:00:00Z',
          endTime: '2099-01-21T09:00:00Z',
        })
      ).toThrow('Cannot create bookings in the past')
    })

    it('should reject bookings at exact current time', () => {
      // Mock clock is at 2099-01-21T09:00:00Z
      // Try to book at exactly 09:00 (same as clock time)
      expect(() =>
        service.createBooking('room-a', {
          startTime: '2099-01-21T09:00:00Z',
          endTime: '2099-01-21T10:00:00Z',
        })
      ).toThrow('Cannot create bookings in the past')
    })

    it('should allow bookings in the future (relative to clock)', () => {
      // Mock clock is at 2099-01-21T09:00:00Z
      // Book at 10:00 (after clock time) - should succeed
      const booking = service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      })

      expect(booking.id).toBeDefined()
      expect(booking.startTime).toBe('2099-01-21T10:00:00.000Z')
    })
  })

  describe('Overlap Detection', () => {
    it('should allow non-overlapping bookings', () => {
      // First booking: 10:00 - 11:00
      const booking1 = service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      })

      // Second booking: 11:00 - 12:00 (starts exactly when first ends)
      const booking2 = service.createBooking('room-a', {
        startTime: '2099-01-21T11:00:00Z',
        endTime: '2099-01-21T12:00:00Z',
      })

      expect(booking1.id).toBeDefined()
      expect(booking2.id).toBeDefined()
      expect(repository.findByRoom('room-a')).toHaveLength(2)
    })

    it('should reject overlapping bookings (new starts during existing)', () => {
      // First booking: 10:00 - 12:00
      service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T12:00:00Z',
      })

      // Second booking: 11:00 - 13:00 (starts during first)
      expect(() =>
        service.createBooking('room-a', {
          startTime: '2099-01-21T11:00:00Z',
          endTime: '2099-01-21T13:00:00Z',
        })
      ).toThrow('overlaps')
    })

    it('should reject overlapping bookings (new contains existing)', () => {
      // First booking: 11:00 - 12:00
      service.createBooking('room-a', {
        startTime: '2099-01-21T11:00:00Z',
        endTime: '2099-01-21T12:00:00Z',
      })

      // Second booking: 10:00 - 13:00 (contains first)
      expect(() =>
        service.createBooking('room-a', {
          startTime: '2099-01-21T10:00:00Z',
          endTime: '2099-01-21T13:00:00Z',
        })
      ).toThrow('overlaps')
    })

    it('should reject overlapping bookings (new inside existing)', () => {
      // First booking: 10:00 - 14:00
      service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T14:00:00Z',
      })

      // Second booking: 11:00 - 12:00 (inside first)
      expect(() =>
        service.createBooking('room-a', {
          startTime: '2099-01-21T11:00:00Z',
          endTime: '2099-01-21T12:00:00Z',
        })
      ).toThrow('overlaps')
    })

    it('should allow same time slot in different rooms', () => {
      const booking1 = service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      })

      const booking2 = service.createBooking('room-b', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      })

      expect(booking1.roomId).toBe('room-a')
      expect(booking2.roomId).toBe('room-b')
    })

    // Edge case tests for [start, end) half-open interval model
    // See docs/TIME_MODEL.md for detailed documentation

    it('should allow adjacent bookings (B starts exactly when A ends)', () => {
      // This is the key test for [start, end) model
      // A: [10:00, 11:00) - owns 10:00, does NOT own 11:00
      // B: [11:00, 12:00) - owns 11:00
      const bookingA = service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      })

      const bookingB = service.createBooking('room-a', {
        startTime: '2099-01-21T11:00:00Z',
        endTime: '2099-01-21T12:00:00Z',
      })

      expect(bookingA.id).toBeDefined()
      expect(bookingB.id).toBeDefined()
    })

    it('should allow adjacent bookings (A starts exactly when B ends)', () => {
      // Same as above but reversed order of creation
      // B: [11:00, 12:00)
      // A: [10:00, 11:00)
      const bookingB = service.createBooking('room-a', {
        startTime: '2099-01-21T11:00:00Z',
        endTime: '2099-01-21T12:00:00Z',
      })

      const bookingA = service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      })

      expect(bookingA.id).toBeDefined()
      expect(bookingB.id).toBeDefined()
    })

    it('should reject exact same time slot', () => {
      // A: [10:00, 11:00)
      // B: [10:00, 11:00) - identical
      service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      })

      expect(() =>
        service.createBooking('room-a', {
          startTime: '2099-01-21T10:00:00Z',
          endTime: '2099-01-21T11:00:00Z',
        })
      ).toThrow('overlaps')
    })

    it('should reject when new booking starts 1ms before existing ends', () => {
      // A: [10:00:00.000, 11:00:00.000)
      // B: [10:59:59.999, 12:00:00.000) - starts 1ms before A ends
      service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00.000Z',
        endTime: '2099-01-21T11:00:00.000Z',
      })

      expect(() =>
        service.createBooking('room-a', {
          startTime: '2099-01-21T10:59:59.999Z',
          endTime: '2099-01-21T12:00:00.000Z',
        })
      ).toThrow('overlaps')
    })

    it('should reject when new booking ends 1ms after existing starts', () => {
      // A: [10:00:00.000, 11:00:00.000)
      // B: [09:30:00.000, 10:00:00.001) - ends 1ms after A starts
      // Note: B starts at 09:30 which is after mock clock (09:00)
      service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00.000Z',
        endTime: '2099-01-21T11:00:00.000Z',
      })

      expect(() =>
        service.createBooking('room-a', {
          startTime: '2099-01-21T09:30:00.000Z',
          endTime: '2099-01-21T10:00:00.001Z',
        })
      ).toThrow('overlaps')
    })

    it('should allow when new booking ends exactly when existing starts', () => {
      // A: [10:00, 11:00)
      // B: [09:30, 10:00) - ends exactly when A starts
      // Note: B starts at 09:30 which is after mock clock (09:00)
      service.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T11:00:00Z',
      })

      const bookingB = service.createBooking('room-a', {
        startTime: '2099-01-21T09:30:00Z',
        endTime: '2099-01-21T10:00:00Z',
      })

      expect(bookingB.id).toBeDefined()
    })
  })

  describe('Booking Cancellation', () => {
    it('should throw 404 when cancelling non-existent booking', () => {
      expect(() => service.cancelBooking('non-existent')).toThrow(AppError)
      expect(() => service.cancelBooking('non-existent')).toThrow('not found')
    })
  })
})
