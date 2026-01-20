---
name: Document Concurrency Limitations
overview: Create documentation explaining why the in-memory implementation is safe in single-process Node.js, the check-then-insert pattern, and what would change with a real database or clustering.
todos:
  - id: create-concurrency-doc
    content: Create docs/CONCURRENCY.md with concurrency limitations documentation
    status: pending
  - id: update-promptit
    content: Update docs/PROMPTIT.md with prompt and response
    status: pending
---

# Document Concurrency Limitations

## Overview

Create `docs/CONCURRENCY.md` to explain:

1. Why current implementation is safe (Node.js event loop)
2. Check-then-insert pattern and its implications
3. What would change with a real database
4. What would change with clustering

## 1. Create Documentation ([docs/CONCURRENCY.md](docs/CONCURRENCY.md))

New file with sections:

### Current Implementation Safety

- Node.js runs JavaScript in a single thread
- Synchronous code between `findByRoom()` and `create()` is atomic
- No `await` between check and insert = no interleaving possible

### Check-Then-Insert Pattern

- Code flow: check for overlap → create booking
- Safe in sync code, problematic with async gaps
- Diagram showing why no race condition occurs

### With Real Database

- Async operations create race window
- Solutions: transactions, database constraints (EXCLUDE USING GIST for PostgreSQL)
- Example of what could go wrong

### With Clustering

- Multiple Node.js processes = multiple event loops
- Database constraint becomes essential
- Distributed locks as alternative

## 2. Update PROMPTIT.md ([docs/PROMPTIT.md](docs/PROMPTIT.md))

Append this prompt and response.

## Files Changed

| File | Changes |
|------|---------|
| `docs/CONCURRENCY.md` | New documentation file |
| `docs/PROMPTIT.md` | Add this prompt/response |