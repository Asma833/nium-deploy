import { z } from 'zod';

export const purposeDocumentFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Document Name is required')
    .regex(/^[A-Za-z][A-Za-z0-9\s\-&,()]*$/, 'Document Name must start with an alphabet')
    .refine((val) => !val.startsWith(' '), { message: 'Cannot start with a space' }),

  display_name: z
    .string()
    .min(1, 'Document Display Name is required')
    .regex(/^[A-Za-z][A-Za-z0-9\s\-&,()]*$/, 'Document Display Name must start with an alphabet')
    .refine((val) => !val.startsWith(' '), { message: 'Cannot start with a space' }),

  code: z
    .string()
    .min(1, 'Document Code is required')
    .regex(/^[A-Za-z0-9]+$/, 'Document Code must contain only alphabets and numbers')
    .refine((val) => !val.startsWith(' '), { message: 'Cannot start with a space' }),

  description: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val && val.trim() !== '') {
          return val.length <= 200;
        }
        return true;
      },
      { message: 'Document Description must be less than 200 characters' }
    )
    .refine(
      (val) => {
        if (val && val.trim() !== '') {
          return /^[A-Za-z][A-Za-z0-9\s\-&,()]*$/.test(val);
        }
        return true;
      },
      { message: 'Document Description must start with an alphabet' }
    )
    .refine(
      (val) => {
        if (typeof val === 'string' && val.length > 0) {
          return !val.startsWith(' ');
        }
        return true;
      },
      { message: 'Cannot start with a space' }
    ),
});
