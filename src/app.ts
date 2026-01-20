import express, { Application } from 'express'

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { bookingRoutes } from './routes/bookingRoutes.js'

/**
 * Create and configure the Express application
 */
export function createApp(): Application {
  const app = express()

  // Middleware
  app.use(express.json())

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API routes
  app.use(bookingRoutes)

  // Error handling
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
