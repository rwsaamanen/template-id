import { createApp } from './app.js';

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  POST   /rooms/:roomId/bookings  - Create a booking`);
  console.log(`  GET    /rooms/:roomId/bookings  - List bookings for a room`);
  console.log(`  DELETE /bookings/:bookingId     - Cancel a booking`);
  console.log(`  GET    /health                  - Health check`);
});
