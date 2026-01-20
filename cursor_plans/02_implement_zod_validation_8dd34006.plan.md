---
name: Implement Zod Validation
overview: Replace the manual validation in bookingValidator.ts with Zod schemas, add a decode helper utility, update AppError to support validation details, and clean up unused code.
todos:
  - id: install-zod
    content: Install zod@^3.25.76
    status: pending
  - id: create-schemas
    content: Create src/schemas/bookingSchemas.ts with Zod schemas and type inference
    status: pending
  - id: create-validation-util
    content: Create src/utils/validation.ts with decode() helper
    status: pending
  - id: update-types
    content: Update AppError class to include optional errors property
    status: pending
  - id: update-error-handler
    content: Update error handler to include validation errors in response
    status: pending
  - id: update-service
    content: Update bookingService.ts to use Zod validation via decode()
    status: pending
  - id: update-tests
    content: Update tests to use new validation approach
    status: pending
  - id: cleanup
    content: Delete old validators/bookingValidator.ts and remove unused code
    status: pending
  - id: update-promptit
    content: Update docs/PROMPTIT.md with this prompt and response
    status: pending
---

# Implement Zod Validation

## New File Structure

```
src/
├── schemas/
│   └── bookingSchemas.ts    # Zod schemas for all booking-related validation
├── utils/
│   └── validation.ts        # decode() helper function
```

## 1. Create Zod Schemas ([src/schemas/bookingSchemas.ts](src/schemas/bookingSchemas.ts))

Define schemas with specific names and custom refinements:

```typescript
import { z } from 'zod'

// ISO-8601 datetime string that parses to a valid Date
const isoDateTimeSchema = z.string().refine(
  (val) => !isNaN(new Date(val).getTime()),
  { message: 'Must be a valid ISO-8601 datetime' }
)

// POST /rooms/:roomId/bookings body
export const createBookingBodySchema = z
  .object({
    startTime: isoDateTimeSchema,
    endTime: isoDateTimeSchema,
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: 'startTime must be before endTime',
    path: ['startTime'],
  })
  .refine((data) => new Date(data.startTime) > new Date(), {
    message: 'Cannot create bookings in the past',
    path: ['startTime'],
  })

// URL params: :roomId
export const roomIdParamsSchema = z.object({
  roomId: z.string().min(1, 'roomId is required'),
})

// URL params: :bookingId
export const bookingIdParamsSchema = z.object({
  bookingId: z.string().min(1, 'bookingId is required'),
})

// Infer types from schemas
export type CreateBookingBody = z.infer<typeof createBookingBodySchema>
export type RoomIdParams = z.infer<typeof roomIdParamsSchema>
export type BookingIdParams = z.infer<typeof bookingIdParamsSchema>
```

## 2. Create Validation Helper ([src/utils/validation.ts](src/utils/validation.ts))

```typescript
import { z } from 'zod'
import { AppError, ErrorCodes } from '../types/index.js'

export function decode<T>(
  schemaName: string,
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }))

    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      `Validation failed for ${schemaName}`,
      errors
    )
  }

  return result.data
}
```

## 3. Update AppError Class ([src/types/index.ts](src/types/index.ts))

Add optional `errors` property for validation details:

```typescript
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly errors?: unknown[]  // NEW: validation details
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

## 4. Update Error Handler ([src/middleware/errorHandler.ts](src/middleware/errorHandler.ts))

Include validation errors in the response:

```typescript
if (err instanceof AppError) {
  const response: { error: ApiError & { errors?: unknown[] } } = {
    error: {
      code: err.code,
      message: err.message,
      ...(err.errors && { errors: err.errors }),  // Include if present
    },
  }
  res.status(err.statusCode).json(response)
  return
}
```

## 5. Update Booking Service ([src/services/bookingService.ts](src/services/bookingService.ts))

Replace old validators with Zod decode:

```typescript
import { decode } from '../utils/validation.js'
import {
  createBookingBodySchema,
  roomIdParamsSchema,
  bookingIdParamsSchema,
  CreateBookingBody,
} from '../schemas/bookingSchemas.js'

createBooking(roomId: string, body: unknown): Booking {
  // Validate using Zod
  decode('roomIdParams', roomIdParamsSchema, { roomId })
  const validated = decode('createBookingBody', createBookingBodySchema, body)

  // ... rest of the method
}
```

## 6. Update Types ([src/types/index.ts](src/types/index.ts))

- Remove `CreateBookingRequest` interface (now derived from Zod schema)
- Update `ApiError` interface to include optional `errors` field

## 7. Cleanup

- Delete [src/validators/bookingValidator.ts](src/validators/bookingValidator.ts) (no longer needed)
- Delete the `src/validators/` directory
- Remove `ValidatedBooking` interface references

## 8. Update Tests ([tests/booking.test.ts](tests/booking.test.ts))

Update validator tests to use the new `decode` function and schemas:

```typescript
import { decode } from '../src/utils/validation.js'
import { createBookingBodySchema } from '../src/schemas/bookingSchemas.js'

// Use decode() instead of validateCreateBooking()
decode('createBookingBody', createBookingBodySchema, body)
```

## Installation

```bash
npm install zod@^3.25.76
```

## Files Changed Summary

| Action | File |

|--------|------|

| Create | `src/schemas/bookingSchemas.ts` |

| Create | `src/utils/validation.ts` |

| Modify | `src/types/index.ts` |

| Modify | `src/middleware/errorHandler.ts` |

| Modify | `src/services/bookingService.ts` |

| Modify | `tests/booking.test.ts` |

| Delete | `src/validators/bookingValidator.ts` |

| Update | `docs/PROMPTIT.md` |