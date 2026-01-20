# Time Model Documentation

This document describes how the booking system handles time intervals and overlap detection.

## Half-Open Interval Model: [start, end)

Bookings use a **half-open interval** model where:

- **Start time is inclusive** - the booking owns this exact moment
- **End time is exclusive** - the next booking can start at this moment

This is written mathematically as `[start, end)` where:
- `[` means inclusive (closed)
- `)` means exclusive (open)

### Why Half-Open Intervals?

This model is widely used in scheduling systems because it:

1. **Allows adjacent bookings** - Meeting A can end at 11:00 and Meeting B can start at 11:00
2. **Avoids ambiguity** - There's no question about who "owns" the boundary moment
3. **Simplifies duration math** - `end - start` gives the exact duration
4. **Matches real-world behavior** - When a meeting ends at 11:00, the room is immediately available

## Overlap Detection

Two time intervals overlap when they share any common time. The formula used is:

```
overlap = (newStart < existingEnd) AND (newEnd > existingStart)
```

### Visual Examples

#### Allowed: Adjacent Bookings

```
Timeline:     09:00    10:00    11:00    12:00    13:00
              |        |        |        |        |
Booking A:            [========)
Booking B:                     [========)

A: 10:00-11:00
B: 11:00-12:00
Result: ALLOWED (B starts exactly when A ends)
```

#### Allowed: Non-Overlapping with Gap

```
Timeline:     09:00    10:00    11:00    12:00    13:00
              |        |        |        |        |
Booking A:            [========)
Booking B:                              [========)

A: 10:00-11:00
B: 12:00-13:00
Result: ALLOWED (gap between bookings)
```

#### Rejected: Partial Overlap

```
Timeline:     09:00    10:00    11:00    12:00    13:00
              |        |        |        |        |
Booking A:            [================)
Booking B:                     [================)

A: 10:00-12:00
B: 11:00-13:00
Result: REJECTED (B starts before A ends)
```

#### Rejected: Exact Same Slot

```
Timeline:     09:00    10:00    11:00    12:00    13:00
              |        |        |        |        |
Booking A:            [========)
Booking B:            [========)

A: 10:00-11:00
B: 10:00-11:00
Result: REJECTED (identical time slots)
```

#### Rejected: New Contains Existing

```
Timeline:     09:00    10:00    11:00    12:00    13:00
              |        |        |        |        |
Booking A:                     [====)
Booking B:            [================)

A: 11:00-12:00 (existing)
B: 10:00-13:00 (new, contains A)
Result: REJECTED (B fully contains A)
```

#### Rejected: New Inside Existing

```
Timeline:     09:00    10:00    11:00    12:00    13:00
              |        |        |        |        |
Booking A:            [================)
Booking B:                     [====)

A: 10:00-13:00 (existing)
B: 11:00-12:00 (new, inside A)
Result: REJECTED (B is fully inside A)
```

## UTC Time Convention

All times in the API are handled in **UTC (Coordinated Universal Time)**:

- Timestamps must be in ISO-8601 format with timezone info
- Recommended format: `2026-01-21T10:00:00Z` (Z suffix indicates UTC)
- Times are stored and compared as UTC internally

### Frontend Responsibility

The frontend is responsible for:

1. **Converting user's local time to UTC** before sending to the API
2. **Converting UTC responses to user's local time** for display
3. **Handling daylight saving time transitions** appropriately

### Example

User in Helsinki (UTC+2 in winter, UTC+3 in summer):

```
User wants to book: 12:00-13:00 local time on Jan 21, 2026
Helsinki is UTC+2 in January
API request should use: 10:00-11:00 UTC

{
  "startTime": "2026-01-21T10:00:00Z",
  "endTime": "2026-01-21T11:00:00Z"
}
```

## Edge Cases

| Scenario | Example | Result |
|----------|---------|--------|
| Adjacent bookings | A: 10:00-11:00, B: 11:00-12:00 | Allowed |
| Exact same slot | A: 10:00-11:00, B: 10:00-11:00 | Rejected |
| 1ms overlap at end | A: 10:00-11:00, B: 10:59:59.999-12:00 | Rejected |
| 1ms overlap at start | A: 10:00-11:00, B: 09:00-10:00:00.001 | Rejected |
| Touching at start | A: 10:00-11:00, B: 09:00-10:00 | Allowed |
| Zero-duration gap | A: 10:00-11:00, B: 11:00-11:00 | Invalid (zero duration) |
