import { z } from 'zod';

export const userSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(3, 'First name must be at least 3 characters')
      .max(50, 'First name must not exceed 50 characters')
      .regex(
        /^[A-Za-z'-]+$/,
        'First name can only contain letters, hyphens, and apostrophes'
      ),

    lastName: z
      .string()
      .trim()
      .min(1, 'Last name must be at least 1 character')
      .max(50, 'Last name must not exceed 50 characters')
      .regex(
        /^[A-Za-z'-]+$/,
        'Last name can only contain letters, hyphens, and apostrophes'
      ),

    email: z.string().email('Invalid email format'),

    productType: z
      .object({
        card: z.boolean(),
        remittance: z.boolean(),
        both: z.boolean(),
      })
      .refine((data) => Object.values(data).some((value) => value === true), {
        message: 'At least one product type must be selected',
      }),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must not exceed 50 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one digit')
      .regex(
        /[@$!%*?&]/,
        'Password must contain at least one special character (@, $, !, %, *, ?, &)'
      ),

    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
