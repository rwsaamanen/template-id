---
name: Integration Tests with Supertest
overview: Create HTTP integration tests using supertest with helper functions, testing all endpoints with proper status codes and response validation.
todos:
  - id: install-supertest
    content: Install supertest and @types/supertest as dev dependencies
    status: pending
  - id: create-api-tests
    content: Create tests/api.test.ts with helper functions and all test scenarios
    status: pending
  - id: run-tests
    content: Run tests to verify all pass
    status: pending
  - id: update-promptit
    content: Update docs/PROMPTIT.md with this prompt and response
    status: pending
---

# Integration Tests with Supertest

## New File

Create [tests/api.test.ts](tests/api.test.ts) with HTTP integration tests.

## Installation

```bash
npm install -D supertest @types/supertest
```

## Test File Structure

```typescript
// tests/api.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { bookingStore } from '../src/storage/bookingStore.js'

const app = createApp()
```

## Helper Functions

Create helper functions to reduce boilerplate:

```typescript
// Helper functions for cleaner test code
const testPost = (url: string, body: object) =>
  request(app).post(url).send(body).set('Content-Type', 'application/json')

const testGet = (url: string) => request(app).get(url)

const testDelete = (url: string) => request(app).delete(url)
```

## Data Reset

Use `beforeEach` to clear the booking store:

```typescript
beforeEach(() => {
  bookingStore.clear()
})
```

## Test Scenarios

### 1. Create Booking (POST /rooms/:roomId/bookings)

| Scenario | Expected Status | Validation |

|----------|----------------|------------|

| Valid booking | 201 | Response has `data` with booking object |

| Missing startTime | 400 | Error has `code: 'VALIDATION_ERROR'` |

| Missing endTime | 400 | Error has validation details |

| Invalid date format | 400 | Error message indicates invalid datetime |

| Past booking | 400 | Error indicates past booking not allowed |

| startTime >= endTime | 400 | Error indicates invalid time range |

| Overlapping booking | 409 | Error has `code: 'BOOKING_OVERLAP'` |

### 2. Get Bookings (GET /rooms/:roomId/bookings)

| Scenario | Expected Status | Validation |

|----------|----------------|------------|

| Empty room | 200 | `{ data: [], count: 0 }` |

| Room with bookings | 200 | `{ data: [...], count: N }` |

### 3. Cancel Booking (DELETE /bookings/:bookingId)

| Scenario | Expected Status | Validation |

|----------|----------------|------------|

| Existing booking | 200 | Success message |

| Non-existent booking | 404 | Error has `code: 'BOOKING_NOT_FOUND'` |

### 4. Not Found Routes

| Scenario | Expected Status | Validation |

|----------|----------------|------------|

| Unknown endpoint | 404 | Error has `code: 'NOT_FOUND'` |

## Response Structure Validation

Success responses:

```typescript
expect(res.body).toHaveProperty('data')
expect(res.body.data).toHaveProperty('id')
expect(res.body.data).toHaveProperty('roomId')
expect(res.body.data).toHaveProperty('startTime')
expect(res.body.data).toHaveProperty('endTime')
expect(res.body.data).toHaveProperty('createdAt')
```

Error responses:

```typescript
expect(res.body).toHaveProperty('error')
expect(res.body.error).toHaveProperty('code')
expect(res.body.error).toHaveProperty('message')
```

## Files Changed

| Action | File |

|--------|------|

| Create | `tests/api.test.ts` |

| Modify | `package.json` (dev dependencies added by npm) |

| Update | `docs/PROMPTIT.md` |