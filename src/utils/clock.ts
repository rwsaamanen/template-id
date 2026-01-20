/**
 * Clock interface for abstracting time operations
 * Enables deterministic time handling in tests
 */
export interface Clock {
  now(): Date
}

/**
 * Real clock implementation using system time
 */
export const realClock: Clock = {
  now: () => new Date(),
}
