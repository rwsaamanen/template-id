import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { AppError, ErrorCodes } from '../types/index.js'

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  path: string
  message: string
}

/**
 * Decode and validate data against a Zod schema
 *
 * @param schemaName - Human-readable name for error messages
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Typed, validated data
 * @throws AppError if validation fails
 */
export function decode<T>(
  schemaName: string,
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors: ValidationErrorDetail[] = result.error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }))

    throw new AppError(
      StatusCodes.BAD_REQUEST,
      ErrorCodes.VALIDATION_ERROR,
      `Validation failed for ${schemaName}`,
      errors
    )
  }

  return result.data
}
