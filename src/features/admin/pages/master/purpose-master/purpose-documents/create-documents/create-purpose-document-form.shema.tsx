import { z } from 'zod';

export const PurposeDocumentFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Document Name is required')
    .regex(/^[A-Za-z][A-Za-z\s\-&,()]*$/, 'Document Name must start with an alphabet')
    .refine(val => !val.startsWith(' '), { message: 'Cannot start with a space' }),

  display_name: z
    .string()
    .min(1, 'Document Display Name is required')
    .regex(/^[A-Za-z][A-Za-z\s\-&,()]*$/, 'Document Display Name must start with an alphabet')
    .refine(val => !val.startsWith(' '), { message: 'Cannot start with a space' }),

  code: z
    .string()
    .min(1, 'Document Code is required')
    .regex(/^[A-Za-z0-9]+$/, 'Document Code must contain only alphabets and numbers')
    .refine(val => !val.startsWith(' '), { message: 'Cannot start with a space' }),

  description: z
    .string()
    .min(1, 'Document Description is required')
    .max(200, 'Document Description must be less than 200 characters')
    .regex(/^[A-Za-z][A-Za-z\s\-&,()]*$/, 'Document Description must start with an alphabet')
    .refine(val => !val.startsWith(' '), { message: 'Cannot start with a space' }),
});