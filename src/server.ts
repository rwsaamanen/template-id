import { createApp } from './app.js'

const PORT = process.env.PORT || 3000

const app = createApp()

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('Available endpoints:')
  console.log(`  POST   /rooms/:roomId/bookings  - Create a booking`)
  console.log(`  GET    /rooms/:roomId/bookings  - List bookings for a room`)
  console.log(`  DELETE /bookings/:bookingId     - Cancel a booking`)
  console.log(`  GET    /health                  - Health check`)
})

// Graceful shutdown handler
// Stops accepting new connections and waits for in-flight requests to complete
function shutdown(signal: string): void {
  console.log(`\n${signal} received. Shutting down gracefully...`)

  server.close(() => {
    console.log('HTTP server closed.')
    process.exit(0)
  })

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error('Forced shutdown after timeout.')
    process.exit(1)
  }, 10000)
}

// Handle shutdown signals ( Ctrl+C, Container/deploy shutdown )
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
