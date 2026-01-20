import { describe, it, expect, beforeEach } from 'vitest'

import { createBookingBodySchema } from '../src/schemas/bookingSchemas.js'
import { bookingService } from '../src/services/bookingService.js'
import { bookingStore } from '../src/storage/bookingStore.js'
import { AppError } from '../src/types/index.js'
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

    it('should reject bookings in the past', () => {
      const body = {
        startTime: '2020-01-19T10:00:00Z', // In the past
        endTime: '2020-01-19T11:00:00Z',
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

describe('Booking Store', () => {
  beforeEach(() => {
    bookingStore.clear()
  })

  it('should create and retrieve a booking', () => {
    const booking = {
      id: 'test-1',
      roomId: 'room-a',
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    }

    bookingStore.create(booking)

    expect(bookingStore.findById('test-1')).toEqual(booking)
  })

  it('should find bookings by room', () => {
    bookingStore.create({
      id: 'test-1',
      roomId: 'room-a',
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })
    bookingStore.create({
      id: 'test-2',
      roomId: 'room-b',
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
      createdAt: '2026-01-20T12:00:00Z',
    })
    bookingStore.create({
      id: 'test-3',
      roomId: 'room-a',
      startTime: '2099-01-21T14:00:00Z',
      endTime: '2099-01-21T15:00:00Z',
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
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
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
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
    })

    // Second booking: 11:00 - 12:00 (starts exactly when first ends)
    const booking2 = bookingService.createBooking('room-a', {
      startTime: '2099-01-21T11:00:00Z',
      endTime: '2099-01-21T12:00:00Z',
    })

    expect(booking1.id).toBeDefined()
    expect(booking2.id).toBeDefined()
    expect(bookingStore.findByRoom('room-a')).toHaveLength(2)
  })

  it('should reject overlapping bookings (new starts during existing)', () => {
    // First booking: 10:00 - 12:00
    bookingService.createBooking('room-a', {
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T12:00:00Z',
    })

    // Second booking: 11:00 - 13:00 (starts during first)
    expect(() =>
      bookingService.createBooking('room-a', {
        startTime: '2099-01-21T11:00:00Z',
        endTime: '2099-01-21T13:00:00Z',
      })
    ).toThrow('overlaps')
  })

  it('should reject overlapping bookings (new contains existing)', () => {
    // First booking: 11:00 - 12:00
    bookingService.createBooking('room-a', {
      startTime: '2099-01-21T11:00:00Z',
      endTime: '2099-01-21T12:00:00Z',
    })

    // Second booking: 10:00 - 13:00 (contains first)
    expect(() =>
      bookingService.createBooking('room-a', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T13:00:00Z',
      })
    ).toThrow('overlaps')
  })

  it('should reject overlapping bookings (new inside existing)', () => {
    // First booking: 10:00 - 14:00
    bookingService.createBooking('room-a', {
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T14:00:00Z',
    })

    // Second booking: 11:00 - 12:00 (inside first)
    expect(() =>
      bookingService.createBooking('room-a', {
        startTime: '2099-01-21T11:00:00Z',
        endTime: '2099-01-21T12:00:00Z',
      })
    ).toThrow('overlaps')
  })

  it('should allow same time slot in different rooms', () => {
    const booking1 = bookingService.createBooking('room-a', {
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
    })

    const booking2 = bookingService.createBooking('room-b', {
      startTime: '2099-01-21T10:00:00Z',
      endTime: '2099-01-21T11:00:00Z',
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
