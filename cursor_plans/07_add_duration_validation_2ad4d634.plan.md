---
name: Add Duration Validation
overview: Add minimum (15 minutes) and maximum (8 hours) duration validation for bookings in the service layer, with constants and comprehensive tests.
todos:
  - id: add-constants
    content: Add BOOKING_DURATION constants to bookingService.ts
    status: pending
  - id: add-validation
    content: Add validateDuration function and call it in createBooking
    status: pending
  - id: add-tests
    content: Add duration validation tests (exactly min/max, below/above limits)
    status: pending
  - id: run-tests
    content: Run all tests to verify everything works
    status: pending
  - id: update-promptit
    content: Update docs/PROMPTIT.md with prompt and response
    status: pending
---

# Add Duration Validation for Bookings

## Duration Constraints

| Constraint | Value | Milliseconds |

|------------|-------|--------------|

| Minimum | 15 minutes | 15 * 60 * 1000 = 900,000 |

| Maximum | 8 hours | 8 * 60 * 60 * 1000 = 28,800,000 |

## 1. Add Duration Constants ([src/services/bookingService.ts](src/services/bookingService.ts))

Add constants at the top of the file (after imports):

```typescript
/**
 * Booking duration constraints
 */
export const BOOKING_DURATION = {
  MIN_MINUTES: 15,
  MAX_HOURS: 8,
  MIN_MS: 15 * 60 * 1000,      // 15 minutes in milliseconds
  MAX_MS: 8 * 60 * 60 * 1000,  // 8 hours in milliseconds
} as const
```

## 2. Add Duration Validation Function ([src/services/bookingService.ts](src/services/bookingService.ts))

Add inside `createBookingService` factory, similar to `checkForOverlap`:

```typescript
function validateDuration(startTime: Date, endTime: Date): void {
  const durationMs = endTime.getTime() - startTime.getTime()

  if (durationMs < BOOKING_DURATION.MIN_MS) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      `Booking duration must be at least ${BOOKING_DURATION.MIN_MINUTES} minutes`
    )
  }

  if (durationMs > BOOKING_DURATION.MAX_MS) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      `Booking duration cannot exceed ${BOOKING_DURATION.MAX_HOURS} hours`
    )
  }
}
```

## 3. Call Validation in createBooking ([src/services/bookingService.ts](src/services/bookingService.ts))

Add after parsing startTime/endTime (line 78), before the past booking check:

```typescript
const startTime = new Date(validated.startTime)
const endTime = new Date(validated.endTime)

// Validate booking duration
validateDuration(startTime, endTime)

// Check if booking is in the past...
```

## 4. Add Tests ([tests/booking.test.ts](tests/booking.test.ts))

Add new describe block "Duration Validation" with edge case tests:

| Test | Duration | Expected |

|------|----------|----------|

| Exactly minimum (15 min) | 15 min | Allowed |

| Exactly maximum (8 hours) | 8 hours | Allowed |

| Below minimum (14 min) | 14 min | Rejected |

| Above maximum (8h 1min) | 8h 1min | Rejected |

| Way too short (1 ms) | 1 ms | Rejected |

| Way too long (24 hours) | 24 hours | Rejected |

## 5. Update PROMPTIT.md ([docs/PROMPTIT.md](docs/PROMPTIT.md))

Append this prompt and response.

## Files Changed

| File | Changes |

|------|---------|

| `src/services/bookingService.ts` | Add BOOKING_DURATION constants, validateDuration function |

| `tests/booking.test.ts` | Add duration validation tests |

| `docs/PROMPTIT.md` | Add this prompt/response |