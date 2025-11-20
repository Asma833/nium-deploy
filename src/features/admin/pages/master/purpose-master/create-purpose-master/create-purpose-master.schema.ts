import { z } from 'zod';

export const purposeMasterSchema = z.object({
  purpose_name: z
    .string()
    .min(2, 'Purpose name must be at least 2 characters')
    .max(50, 'Purpose name must be less than 50 characters')
    .nonempty('Purpose name is required'),

  purpose_code: z
    .string()
    .min(2, 'Purpose code must be at least 2 characters')
    .max(10, 'Purpose code must be less than 10 characters')
    .nonempty('Purpose code is required'),
});
