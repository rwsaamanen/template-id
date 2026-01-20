# Code Audit: Meeting Room Booking API

This document contains a comprehensive code audit of the `template-id` project, including findings, improvement opportunities, and an architecture analysis.

---

## Part 1: Findings & Improvement Opportunities

### CRITICAL

*No critical bugs found.* The code correctly fulfills the basic requirements.

---

### HIGH Priority

#### H1: Singleton BookingStore Prevents Test Isolation and Production Scaling

**Problem:** [bookingStore.ts](../src/storage/bookingStore.ts) exports a singleton instance (`export const bookingStore = new BookingStore()`). This means:
- Tests share the same instance (requires `clear()` in every test)
- Cannot inject different storage implementations (e.g., Redis, PostgreSQL)
- Cannot run parallel tests safely

**Impact:** Test reliability, future extensibility, dependency injection impossible.

**Suggested Fix:**
```typescript
// Create interface and inject into service layer
export interface BookingRepository {
  create(booking: Booking): Booking;
  findById(id: string): Booking | undefined;
  findByRoom(roomId: string): Booking[];
  delete(id: string): boolean;
}

// bookingService takes repository in constructor
export function createBookingService(repo: BookingRepository) { ... }
```

---

#### H2: No ESLint/Prettier Configuration

**Problem:** The project has no `.eslintrc`, `.prettierrc` or similar configuration files.

**Impact:** Code quality may vary, style differences cause unnecessary merge conflicts, no automatic error detection.

**Suggested Fix:** Add:
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier
```
And create `.eslintrc.json` and `.prettierrc` files.

---

#### H3: No Request Body Size Limit

**Problem:** [app.ts](../src/app.ts) uses `express.json()` without a `limit` parameter.

**Impact:** An attacker can send a huge JSON body and crash the server (DoS).

**Suggested Fix:**
```typescript
app.use(express.json({ limit: '10kb' }));
```

---

#### H4: Missing Clock Injection Prevents Reliable Testing

**Problem:** [bookingValidator.ts](../src/validators/bookingValidator.ts) takes `now: Date = new Date()` as a parameter in the validator, but [bookingService.ts](../src/services/bookingService.ts) line 34 uses `new Date()` directly for `createdAt`.

**Impact:** `createdAt` cannot be tested deterministically, time logic is scattered.

**Suggested Fix:** Create a `Clock` abstraction:
```typescript
export interface Clock {
  now(): Date;
}
export const systemClock: Clock = { now: () => new Date() };
```
Inject into service layer.

---

### MEDIUM Priority

#### M1: Loose Typing - `body as Record<string, unknown>`

**Problem:** [bookingValidator.ts](../src/validators/bookingValidator.ts) line 28 uses an `as` cast after validation.

**Impact:** Type-safety is weakened, potential runtime errors.

**Suggested Fix:** Use type guard functions or Zod/Yup libraries for type-safe validation.

---

#### M2: No Rate Limiting Protection

**Problem:** The API does not limit the number of requests.

**Impact:** Vulnerable to brute force attacks and DoS.

**Suggested Fix:**
```bash
npm install express-rate-limit
```
```typescript
import rateLimit from 'express-rate-limit';
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

---

#### M3: No CORS Configuration

**Problem:** CORS is not defined.

**Impact:** Frontend applications cannot call the API from different domains.

**Suggested Fix:**
```bash
npm install cors
```
```typescript
import cors from 'cors';
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));
```

---

#### M4: Overlap Check is O(n) for Every Booking

**Problem:** [bookingService.ts](../src/services/bookingService.ts) `checkForOverlap` iterates through all bookings for a room.

**Impact:** Performance degrades when there are many bookings.

**Suggested Fix:** Use a time-sorted data structure (e.g., interval tree) or index by room. For an in-memory solution this is not critical, but document the limitation.

---

#### M5: No Integration Tests for HTTP Endpoints

**Problem:** [booking.test.ts](../tests/booking.test.ts) only tests at the unit level (validator, store, service). Express routes are not tested.

**Impact:** Middleware, HTTP status codes, and JSON responses are not verified by tests.

**Suggested Fix:** Add supertest:
```bash
npm install -D supertest @types/supertest
```
```typescript
import request from 'supertest';
import { createApp } from '../src/app';

it('POST /rooms/:roomId/bookings returns 201', async () => {
  const res = await request(createApp())
    .post('/rooms/room-a/bookings')
    .send({ startTime: '...', endTime: '...' });
  expect(res.status).toBe(201);
});
```

---

#### M6: Missing Helmet Security Headers

**Problem:** No HTTP security headers.

**Impact:** Vulnerable to XSS, clickjacking, and other attacks.

**Suggested Fix:**
```bash
npm install helmet
```
```typescript
import helmet from 'helmet';
app.use(helmet());
```

---

### LOW Priority

#### L1: Console.log in Production

**Problem:** [errorHandler.ts](../src/middleware/errorHandler.ts) uses `console.error`, [server.ts](../src/server.ts) uses `console.log`.

**Impact:** No structured logging, no log levels, no JSON logs.

**Suggested Fix:** Use pino or winston library.

---

#### L2: Missing NOT_FOUND in ErrorCodes

**Problem:** [errorHandler.ts](../src/middleware/errorHandler.ts) line 62 uses hard-coded `'NOT_FOUND'` string, but [types/index.ts](../src/types/index.ts) `ErrorCodes` object does not have `NOT_FOUND`.

**Impact:** Inconsistency in error code usage.

**Suggested Fix:** Add `NOT_FOUND: 'NOT_FOUND'` to ErrorCodes object.

---

#### L3: Package.json "main" Points to .ts File

**Problem:** [package.json](../package.json) line 4: `"main": "src/server.ts"` - should be compiled `.js`.

**Impact:** Does not work without tsx.

**Suggested Fix:** `"main": "dist/server.js"` or remove entirely.

---

#### L4: No .nvmrc or engines Field

**Problem:** Node.js version is not defined.

**Impact:** May behave differently on different Node versions.

**Suggested Fix:** Add to package.json:
```json
"engines": { "node": ">=18.0.0" }
```

---

#### L5: Missing Maximum Booking Duration Validation

**Problem:** A booking can be 1ms or 100 years long.

**Impact:** Does not match real business logic.

**Suggested Fix:** Add min/max duration validation (e.g., 15min - 8h). Documented in README as an assumption.

---

#### L6: CreateBookingRequest Type Not Used

**Problem:** [types/index.ts](../src/types/index.ts) defines `CreateBookingRequest`, but it is not used anywhere - validator takes `unknown`.

**Impact:** Unnecessary type, confusing.

**Suggested Fix:** Use the type or remove it.

---

## Part 2: Architecture & Design Patterns Audit

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│                     (HTTP Requests)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     Express Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Middleware  │──│    Routes    │──│  Error Handler   │   │
│  │ (express.json)│ │(bookingRoutes)│ │ (errorHandler)   │   │
│  └──────────────┘  └──────┬───────┘  └──────────────────┘   │
└─────────────────────────────┼───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Business Layer                           │
│  ┌──────────────────┐  ┌────────────────────────────────┐   │
│  │  BookingService  │──│      BookingValidator          │   │
│  │ (business logic) │  │    (input validation)          │   │
│  └────────┬─────────┘  └────────────────────────────────┘   │
└───────────┼─────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────┐
│                      Data Layer                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              BookingStore (in-memory Map)            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Strengths:**
- Clear layered architecture (Routes → Service → Storage)
- Each layer is in its own file
- Middleware pattern for error handling

**Weaknesses:**
- Singleton pattern prevents dependency injection
- No clear "domain layer" separation

---

### Separation of Concerns Analysis

| Layer | File | Responsibility | Assessment |
|-------|------|----------------|------------|
| Routes | `bookingRoutes.ts` | HTTP request/response, delegates to service | OK |
| Service | `bookingService.ts` | Business logic, validation, overlap checking | OK |
| Storage | `bookingStore.ts` | CRUD operations, no business logic | OK |
| Validator | `bookingValidator.ts` | Input validation | OK |
| Types | `types/index.ts` | Types, error classes, error codes | OK |
| Middleware | `errorHandler.ts` | Error HTTP responses | OK |

**Assessment:** Separation of concerns is implemented well. Each module does one thing.

---

### Dependency Direction

```
Routes ──────► Service ──────► Storage
                 │                │
                 ▼                ▼
             Validator         Types
                 │
                 ▼
               Types
```

**Analysis:**
- Dependencies flow in the right direction (outside-in)
- `Types` is a shared dependency - OK
- **Problem:** Service directly imports concrete `bookingStore`, not an abstraction

**From Clean Architecture perspective:**
- Missing interface for storage layer
- Domain entities (Booking) are OK
- Use cases (createBooking, cancelBooking) are in service layer - OK

---

### State Management (In-Memory)

**Current Implementation:**
- `Map<string, Booking>` in memory
- Singleton instance
- O(1) lookup by ID
- O(n) lookup by room

**Swappability to Real Database:**
- **Easy:** Storage layer is isolated
- **Requires:** Interface abstraction (`BookingRepository`)
- **To Fix:** Service should not import concrete storage

---

### Error Model Strategy

**Strengths:**
- Single `AppError` class for all errors
- Typed error codes (`ErrorCodes`)
- Centralized error middleware
- Consistent HTTP status codes

**Weaknesses:**
- `NOT_FOUND` missing from ErrorCodes (but used anyway)
- No error cause chaining (`Error.cause`)

---

### Validation Strategy

**Where validation happens:**
1. `bookingValidator.ts` - input validation (body, dates)
2. `bookingService.ts` - business validation (overlap, room/booking ID)

**Assessment:** Good separation. Input validation is separate from business rules.

**Improvements:**
- Validator could return Result type instead of throwing errors
- Zod/Yup library would provide automatic type-safety

---

### Time Handling Strategy

**Current:**
- ISO-8601 parsing with `new Date(value)`
- Validator takes `now: Date` parameter (good!)
- Service uses `new Date()` directly (bad!)

**Suggested Fix:** Unified Clock abstraction for all time dependencies.

---

### ID Generation Strategy

**Current:** `uuid.v4()` - cryptographically secure, collision probability extremely low.

**Assessment:** OK for production use. Alternatives: ULID (sortable) or nanoid (smaller).

---

### Testing Strategy

**What is tested:**
- Validator: 8 tests
- Storage: 4 tests  
- Service overlap: 6 tests

**What is missing:**
- HTTP integration tests (Express routes)
- Error middleware tests
- Edge cases: empty roomId, special characters

**Test coverage:** Estimated ~70% of logic, 0% of HTTP layer.

---

### Design Patterns Analysis

| Pattern | Used? | Assessment |
|---------|-------|------------|
| **Service Layer** | Yes | `bookingService` encapsulates business logic |
| **Repository Pattern** | Partially | `bookingStore` is a repository, but no interface |
| **Dependency Injection** | No | Singleton imports, no injection |
| **Factory Pattern** | Partially | `createApp()` is a factory |
| **Middleware Pattern** | Yes | Express error handling |
| **DTO Pattern** | No | Direct Booking entity in API |
| **Domain Model** | Simple | `Booking` interface |

---

### Recommended Refactoring Steps (in small commits)

1. **Add ESLint + Prettier** (1 commit)
2. **Add helmet + express.json limit** (1 commit)
3. **Add NOT_FOUND to ErrorCodes** (1 commit)
4. **Create BookingRepository interface** (1 commit)
5. **Refactor bookingService to use DI** (1 commit)
6. **Create Clock abstraction** (1 commit)
7. **Add integration tests with supertest** (1 commit)
8. **Add rate limiting** (1 commit)

---

## Summary

### Strengths

- Clear layered architecture
- Good separation of concerns
- Comprehensive validation and error handling
- Working overlap logic
- Good unit tests for critical logic
- Documented assumptions in README

### Weaknesses

- Singleton pattern prevents testability and extensibility
- No security middlewares (helmet, rate limit, CORS)
- No linting tools
- Missing integration tests
- Time handling is not fully injectable

### Overall Assessment

Good foundation for a production application. Basic requirements are correctly fulfilled. Improvements focus on testability, security, and extensibility.
