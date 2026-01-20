# Concurrency and Race Conditions

This document explains the concurrency characteristics of the booking system's overlap detection.

## Current Implementation: Safe in Single Process

The in-memory implementation is **safe from race conditions** because:

1. **Node.js runs JavaScript in a single thread** - Only one piece of JavaScript executes at a time
2. **Synchronous code is atomic** - No interleaving between `findByRoom()` and `create()`
3. **No `await` between check and insert** - The event loop cannot switch to another request mid-operation

### The Check-Then-Insert Pattern

```typescript
// This entire block runs atomically (no await = no interleaving)
const existingBookings = repository.findByRoom(roomId)  // Check
for (const existing of existingBookings) {
  if (overlaps) throw new AppError(...)
}
repository.create(booking)  // Insert
```

Because there's no `await` between the check and insert, Node.js **cannot** process another request in the middle. The event loop only yields control at `await` points.

### Why No Race Condition Occurs

```
Request A: [──check──insert──]
Request B:                    [──check──insert──]
                              ↑
                              B starts only after A completes
```

## With a Real Database: Race Window Opens

If we used a real database with async operations:

```typescript
const existingBookings = await db.query('SELECT * FROM bookings...')  // Check
// ⚠️ RACE WINDOW: Another request could insert here!
await db.query('INSERT INTO bookings...')  // Insert
```

### The Problem

```
Request A: [──check──]     [──insert──]
Request B:           [──check──]     [──insert──]
                     ↑
                     B checks before A inserts = both succeed = OVERLAP!
```

### Solutions for Real Databases

1. **Database Transaction with Serializable Isolation**
   ```sql
   BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
   SELECT ... FOR UPDATE;
   INSERT ...;
   COMMIT;
   ```

2. **Database Constraint (PostgreSQL)**
   ```sql
   -- Exclusion constraint prevents overlapping ranges
   ALTER TABLE bookings ADD CONSTRAINT no_overlap
   EXCLUDE USING GIST (room_id WITH =, tstzrange(start_time, end_time) WITH &&);
   ```
   This is the most robust solution - the database enforces the constraint regardless of application bugs.

3. **Optimistic Locking**
   - Check, insert, catch constraint violation, retry or fail

## With Clustering: Multiple Event Loops

Running multiple Node.js processes (e.g., PM2 cluster mode, Kubernetes replicas):

```
Process 1: [──check──insert──]
Process 2: [──check──insert──]
           ↑
           Both processes run simultaneously = race condition possible!
```

Each process has its own event loop and in-memory store. Even synchronous code doesn't protect you because **processes don't share memory**.

### Solutions for Clustering

1. **Rely on Database Constraint** (recommended)
   - Let the database be the source of truth
   - Application catches constraint violations and returns appropriate error

2. **Distributed Lock** (e.g., Redis)
   ```typescript
   const lock = await redis.lock(`room:${roomId}`)
   try {
     // check and insert
   } finally {
     await lock.release()
   }
   ```
   More complex, adds Redis dependency, but works with any database.

3. **Single Writer Architecture**
   - Route all writes for a room to the same process
   - Complex to implement correctly

## Summary

| Scenario | Safe? | Why |
|----------|-------|-----|
| Single process, in-memory | Yes | Sync code is atomic |
| Single process, real DB | No | Async creates race window |
| Multiple processes, in-memory | No | Separate memory spaces |
| Multiple processes, real DB | No | Both problems combined |

**Recommendation**: When moving to production with a real database, add a database-level constraint (like PostgreSQL's `EXCLUDE USING GIST`) as the primary defense. Application-level checks remain useful for providing friendly error messages before hitting the constraint.
