import express, { Application } from 'express'

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { bookingRoutes, createBookingRoutes } from './routes/bookingRoutes.js'
import { BookingService } from './types/index.js'

/**
 * Dependencies that can be injected into the app
 */
export interface AppDependencies {
  bookingService?: BookingService
}

/**
 * Create and configure the Express application
 * Accepts optional dependencies for testing and flexibility
 */
export function createApp(deps: AppDependencies = {}): Application {
  const app = express()

  // Middleware
  app.use(express.json({ limit: '100kb' }))

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API routes - use injected service or default singleton
  const routes = deps.bookingService
    ? createBookingRoutes(deps.bookingService)
    : bookingRoutes
  app.use(routes)

  // Error handling
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
