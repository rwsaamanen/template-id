import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'

import { createApp } from '../src/app.js'
import { bookingStore } from '../src/storage/bookingStore.js'

/**
 * Integration tests use the default singleton app with bookingStore.clear()
 * For full isolation, you could create fresh instances per test:
 *
 *   const repo = createBookingRepository()
 *   const service = createBookingService(repo)
 *   const app = createApp({ bookingService: service })
 */
const app = createApp()

// Helper functions for cleaner test code
const testPost = (url: string, body: object) =>
  request(app).post(url).send(body).set('Content-Type', 'application/json')

const testGet = (url: string) => request(app).get(url)

const testDelete = (url: string) => request(app).delete(url)

// Valid future booking data for tests
const validBooking = {
  startTime: '2099-01-21T10:00:00Z',
  endTime: '2099-01-21T11:00:00Z',
}

describe('API Integration Tests', () => {
  beforeEach(() => {
    bookingStore.clear()
  })

  describe('Health Check', () => {
    it('should return health status (200)', async () => {
      const res = await testGet('/health')

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('status', 'ok')
      expect(res.body).toHaveProperty('timestamp')
    })
  })

  describe('404 Not Found', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await testGet('/unknown/route')

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('code', 'NOT_FOUND')
      expect(res.body.error).toHaveProperty('message')
    })
  })

  describe('POST /rooms/:roomId/bookings - Create Booking', () => {
    it('should create a booking successfully (201)', async () => {
      const res = await testPost('/rooms/conference-a/bookings', validBooking)

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('data')
      expect(res.body.data).toHaveProperty('id')
      expect(res.body.data).toHaveProperty('roomId', 'conference-a')
      expect(res.body.data).toHaveProperty('startTime')
      expect(res.body.data).toHaveProperty('endTime')
      expect(res.body.data).toHaveProperty('createdAt')
    })

    it('should return 400 when startTime is missing', async () => {
      const res = await testPost('/rooms/conference-a/bookings', {
        endTime: '2099-01-21T11:00:00Z',
      })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR')
      expect(res.body.error).toHaveProperty('message')
    })

    it('should return 400 when endTime is missing', async () => {
      const res = await testPost('/rooms/conference-a/bookings', {
        startTime: '2099-01-21T10:00:00Z',
      })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR')
    })

    it('should return 400 for invalid date format', async () => {
      const res = await testPost('/rooms/conference-a/bookings', {
        startTime: 'not-a-date',
        endTime: '2099-01-21T11:00:00Z',
      })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR')
    })

    it('should return 400 when booking is in the past', async () => {
      const res = await testPost('/rooms/conference-a/bookings', {
        startTime: '2020-01-21T10:00:00Z',
        endTime: '2020-01-21T11:00:00Z',
      })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR')
    })

    it('should return 400 when startTime equals endTime', async () => {
      const res = await testPost('/rooms/conference-a/bookings', {
        startTime: '2099-01-21T10:00:00Z',
        endTime: '2099-01-21T10:00:00Z',
      })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR')
    })

    it('should return 400 when startTime is after endTime', async () => {
      const res = await testPost('/rooms/conference-a/bookings', {
        startTime: '2099-01-21T12:00:00Z',
        endTime: '2099-01-21T10:00:00Z',
      })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR')
    })

    it('should return 409 for overlapping booking', async () => {
      // Create first booking
      await testPost('/rooms/conference-a/bookings', validBooking)

      // Try to create overlapping booking
      const res = await testPost('/rooms/conference-a/bookings', {
        startTime: '2099-01-21T10:30:00Z',
        endTime: '2099-01-21T11:30:00Z',
      })

      expect(res.status).toBe(409)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('code', 'BOOKING_OVERLAP')
      expect(res.body.error).toHaveProperty('message')
    })

    it('should allow adjacent bookings (end time = start time)', async () => {
      // Create first booking: 10:00 - 11:00
      await testPost('/rooms/conference-a/bookings', validBooking)

      // Create adjacent booking: 11:00 - 12:00
      const res = await testPost('/rooms/conference-a/bookings', {
        startTime: '2099-01-21T11:00:00Z',
        endTime: '2099-01-21T12:00:00Z',
      })

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('data')
    })

    it('should allow same time slot in different rooms', async () => {
      // Create booking in room A
      await testPost('/rooms/conference-a/bookings', validBooking)

      // Create same time slot in room B
      const res = await testPost('/rooms/conference-b/bookings', validBooking)

      expect(res.status).toBe(201)
      expect(res.body.data).toHaveProperty('roomId', 'conference-b')
    })
  })

  describe('GET /rooms/:roomId/bookings - List Bookings', () => {
    it('should return empty list for room with no bookings (200)', async () => {
      const res = await testGet('/rooms/empty-room/bookings')

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body).toHaveProperty('count', 0)
      expect(res.body.data).toEqual([])
    })

    it('should return all bookings for a room (200)', async () => {
      // Create two bookings
      await testPost('/rooms/conference-a/bookings', validBooking)
      await testPost('/rooms/conference-a/bookings', {
        startTime: '2099-01-21T14:00:00Z',
        endTime: '2099-01-21T15:00:00Z',
      })

      const res = await testGet('/rooms/conference-a/bookings')

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body).toHaveProperty('count', 2)
      expect(res.body.data).toHaveLength(2)
      expect(res.body.data[0]).toHaveProperty('roomId', 'conference-a')
    })

    it('should only return bookings for the specified room', async () => {
      // Create bookings in different rooms
      await testPost('/rooms/conference-a/bookings', validBooking)
      await testPost('/rooms/conference-b/bookings', {
        startTime: '2099-01-21T14:00:00Z',
        endTime: '2099-01-21T15:00:00Z',
      })

      const res = await testGet('/rooms/conference-a/bookings')

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('count', 1)
      expect(res.body.data[0]).toHaveProperty('roomId', 'conference-a')
    })

    it('should return bookings sorted by start time', async () => {
      // Create bookings out of order
      await testPost('/rooms/conference-a/bookings', {
        startTime: '2099-01-21T14:00:00Z',
        endTime: '2099-01-21T15:00:00Z',
      })
      await testPost('/rooms/conference-a/bookings', validBooking) // 10:00 - 11:00

      const res = await testGet('/rooms/conference-a/bookings')

      expect(res.status).toBe(200)
      expect(res.body.data[0].startTime).toBe('2099-01-21T10:00:00.000Z')
      expect(res.body.data[1].startTime).toBe('2099-01-21T14:00:00.000Z')
    })
  })

  describe('DELETE /bookings/:bookingId - Cancel Booking', () => {
    it('should cancel an existing booking (200)', async () => {
      // Create a booking first
      const createRes = await testPost(
        '/rooms/conference-a/bookings',
        validBooking
      )
      const bookingId = createRes.body.data.id

      // Cancel the booking
      const res = await testDelete(`/bookings/${bookingId}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('message')

      // Verify booking is gone
      const listRes = await testGet('/rooms/conference-a/bookings')
      expect(listRes.body.count).toBe(0)
    })

    it('should return 404 for non-existent booking', async () => {
      const res = await testDelete('/bookings/non-existent-id')

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toHaveProperty('code', 'BOOKING_NOT_FOUND')
      expect(res.body.error).toHaveProperty('message')
    })
  })
})
