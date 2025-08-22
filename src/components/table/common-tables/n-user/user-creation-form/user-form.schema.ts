import { z } from 'zod';

export const userSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email format')
      .refine((email) => {
        // Check that the local part doesn't start with a hyphen
        const localPart = email.split('@')[0];
        return localPart && !localPart.startsWith('-');
      }, 'Email address cannot start with a hyphen')
      // Check for invalid characters or trailing commas
      .refine((email) => {
        return !email.includes(',');
      }, 'Email address cannot contain commas'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must not exceed 50 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one digit')
      .regex(/[@$!%*?&]/, 'A special character is required (e.g., ! @ # $ % ^ & ).')
      .regex(/^(?!-)/, 'Password cannot start with a hyphen'),
    confirmPassword: z
      .string()
      .min(1, 'Confirm password is required')
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
