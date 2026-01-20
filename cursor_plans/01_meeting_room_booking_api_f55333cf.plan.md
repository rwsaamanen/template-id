---
name: Meeting Room Booking API
overview: Create a production-quality TypeScript/Express REST API for meeting room bookings with in-memory storage, proper validation, and centralized error handling.
todos:
  - id: setup
    content: Create project structure with package.json and tsconfig.json
    status: completed
  - id: types
    content: Define TypeScript interfaces for Booking, requests, and errors
    status: completed
  - id: storage
    content: Implement in-memory booking store with Map
    status: completed
  - id: validators
    content: Create input validation for booking requests
    status: completed
  - id: service
    content: Implement booking service with overlap detection
    status: completed
  - id: middleware
    content: Add centralized error handling middleware
    status: completed
  - id: routes
    content: Wire up Express routes to service layer
    status: completed
  - id: app-server
    content: Create app.ts and server.ts entry points
    status: completed
  - id: tests
    content: Add unit tests for validation and overlap logic
    status: completed
  - id: readme
    content: Write README with install, run, curl examples, and assumptions
    status: completed
---

# Meeting Room Booking REST API

## Project Structure

```
dev/template-id/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
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
└── tests/
    └── booking.test.ts     # Unit tests
```

## API Endpoints

| Method | Endpoint | Description |

|--------|----------|-------------|

| POST | `/rooms/:roomId/bookings` | Create a new booking |

| GET | `/rooms/:roomId/bookings` | List all bookings for a room |

| DELETE | `/bookings/:bookingId` | Cancel a booking |

## Key Implementation Details

### 1. Types (`src/types/index.ts`)

```typescript
interface Booking {
  id: string;
  roomId: string;
  startTime: string;  // ISO-8601
  endTime: string;    // ISO-8601
  createdAt: string;  // ISO-8601
}

interface CreateBookingRequest {
  startTime: string;
  endTime: string;
}

interface ApiError {
  status: number;
  message: string;
  code: string;
}
```

### 2. In-Memory Storage (`src/storage/bookingStore.ts`)

- Use a `Map<string, Booking>` for O(1) lookup by booking ID
- Provide methods: `create`, `delete`, `findByRoom`, `findById`
- Thread-safe for single-process Node.js

### 3. Validation (`src/validators/bookingValidator.ts`)

Validates:

- Required fields present (`startTime`, `endTime`)
- Valid ISO-8601 format (parseable by `Date`)
- `startTime` is before `endTime`
- Booking is not in the past

### 4. Service Layer (`src/services/bookingService.ts`)

Enforces business rules:

- **Overlap detection**: Check if new booking's time range intersects with existing bookings for the same room
- Overlap formula: `newStart < existingEnd && newEnd > existingStart`

### 5. Error Handling (`src/middleware/errorHandler.ts`)

Centralized middleware with consistent JSON responses:

```typescript
{
  "error": {
    "code": "BOOKING_OVERLAP",
    "message": "The requested time slot overlaps with an existing booking"
  }
}
```

HTTP Status Codes:

- `201` - Booking created
- `200` - Success (GET, DELETE)
- `400` - Validation error
- `404` - Booking/room not found
- `409` - Booking overlap conflict
- `500` - Internal server error

### 6. Routes (`src/routes/bookingRoutes.ts`)

Wire up endpoints to service methods with proper request/response handling.

## Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/uuid": "^9.0.7",
    "typescript": "^5.3.0",
    "tsx": "^4.6.0",
    "vitest": "^1.0.0"
  }
}
```

Using `tsx` for development (fast TypeScript execution without build step) and `vitest` for testing.

## Example curl Requests

**Create booking:**

```bash
curl -X POST http://localhost:3000/rooms/conference-a/bookings \
  -H "Content-Type: application/json" \
  -d '{"startTime": "2026-01-21T10:00:00Z", "endTime": "2026-01-21T11:00:00Z"}'
```

**List bookings:**

```bash
curl http://localhost:3000/rooms/conference-a/bookings
```

**Cancel booking:**

```bash
curl -X DELETE http://localhost:3000/bookings/{bookingId}
```

## Assumptions

1. **No authentication/authorization** - API is open; auth would be added via middleware in production
2. **Single server instance** - In-memory store doesn't sync across processes
3. **Room IDs are implicit** - Rooms don't need to be pre-created; any string is a valid room ID
4. **Timezone handling** - All times are UTC (ISO-8601 with Z suffix recommended)
5. **No booking modifications** - Only create/cancel, no update endpoint
6. **Bookings persist until server restart** - No persistence layer
7. **No pagination** - GET returns all bookings for a room
8. **Minimum booking duration** - Not enforced (could be 1 second)

## Testing Strategy

Unit tests covering:

- Validation logic (invalid dates, missing fields, past bookings)
- Overlap detection (various edge cases)
- Service layer CRUD operations