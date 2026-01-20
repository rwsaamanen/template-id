# Meeting Room Booking API

A minimal but production-quality REST API for managing meeting room bookings, built with TypeScript and Express.

## Features

- Create bookings for meeting rooms
- Cancel existing bookings
- View all bookings for a specific room
- Business rule enforcement (no overlaps, no past bookings)
- Input validation with clear error messages
- In-memory storage (no database setup required)

## Installation

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Or start without hot reload
npm start
```

The server runs on `http://localhost:3000` by default. Set the `PORT` environment variable to change this.

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## API Endpoints

| Method | Endpoint                     | Description                  |
|--------|------------------------------|------------------------------|
| POST   | `/rooms/:roomId/bookings`    | Create a new booking         |
| GET    | `/rooms/:roomId/bookings`    | List all bookings for a room |
| DELETE | `/bookings/:bookingId`       | Cancel a booking             |
| GET    | `/health`                    | Health check                 |

## Example curl Requests

### Create a booking

```bash
curl -X POST http://localhost:3000/rooms/conference-a/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2026-01-21T10:00:00Z",
    "endTime": "2026-01-21T11:00:00Z"
  }'
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "roomId": "conference-a",
    "startTime": "2026-01-21T10:00:00.000Z",
    "endTime": "2026-01-21T11:00:00.000Z",
    "createdAt": "2026-01-20T15:30:00.000Z"
  }
}
```

### List bookings for a room

```bash
curl http://localhost:3000/rooms/conference-a/bookings
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "roomId": "conference-a",
      "startTime": "2026-01-21T10:00:00.000Z",
      "endTime": "2026-01-21T11:00:00.000Z",
      "createdAt": "2026-01-20T15:30:00.000Z"
    }
  ],
  "count": 1
}
```

### Cancel a booking

```bash
curl -X DELETE http://localhost:3000/bookings/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "message": "Booking cancelled successfully"
}
```

## Error Responses

All errors return a consistent JSON structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Error Codes

| Code               | HTTP Status | Description                                    |
|--------------------|-------------|------------------------------------------------|
| VALIDATION_ERROR   | 400         | Invalid input (missing fields, bad format)     |
| INVALID_TIME_RANGE | 400         | startTime is not before endTime                |
| PAST_BOOKING       | 400         | Attempting to book in the past                 |
| BOOKING_NOT_FOUND  | 404         | Booking ID does not exist                      |
| BOOKING_OVERLAP    | 409         | Time slot conflicts with existing booking      |
| INTERNAL_ERROR     | 500         | Unexpected server error                        |

### Example: Validation Error

```bash
curl -X POST http://localhost:3000/rooms/room-a/bookings \
  -H "Content-Type: application/json" \
  -d '{"startTime": "2026-01-21T10:00:00Z"}'
```

**Response (400 Bad Request):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "endTime is required"
  }
}
```

### Example: Overlap Error

```bash
# After creating a booking for 10:00-11:00
curl -X POST http://localhost:3000/rooms/conference-a/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2026-01-21T10:30:00Z",
    "endTime": "2026-01-21T11:30:00Z"
  }'
```

**Response (409 Conflict):**
```json
{
  "error": {
    "code": "BOOKING_OVERLAP",
    "message": "The requested time slot overlaps with an existing booking (2026-01-21T10:00:00.000Z - 2026-01-21T11:00:00.000Z)"
  }
}
```

## Project Structure

```
template-id/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces and error types
│   ├── storage/
│   │   └── bookingStore.ts # In-memory data store
│   ├── validators/
│   │   └── bookingValidator.ts # Input validation
│   ├── services/
│   │   └── bookingService.ts   # Business logic
│   ├── routes/
│   │   └── bookingRoutes.ts    # Route definitions
│   └── middleware/
│       └── errorHandler.ts     # Centralized error handling
├── tests/
│   └── booking.test.ts     # Unit tests
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Assumptions

Since there was no customer to clarify requirements, the following assumptions were made:

1. **No authentication/authorization** - The API is open. In production, authentication middleware would be added.

2. **Room IDs are implicit** - Rooms do not need to be pre-created. Any string is a valid room ID, and bookings can be made for any room.

3. **Single server instance** - The in-memory store does not synchronize across multiple processes. For horizontal scaling, a shared database would be needed.

4. **UTC timezone** - All timestamps are treated as UTC. Clients should send ISO-8601 timestamps with timezone info (preferably with `Z` suffix for UTC).

5. **No booking modifications** - Bookings can only be created or cancelled. To change a booking, cancel it and create a new one.

6. **Data persists until restart** - There is no persistence layer. All bookings are lost when the server restarts.

7. **No pagination** - The GET endpoint returns all bookings for a room. For rooms with many bookings, pagination would be needed.

8. **No minimum booking duration** - A booking could technically be 1 millisecond. In production, a minimum duration might be enforced.

9. **Adjacent bookings allowed** - A booking can start at the exact moment another ends (e.g., 10:00-11:00 and 11:00-12:00 do not overlap).

10. **Booking IDs are UUIDs** - Generated server-side using uuid v4.

## License

MIT
