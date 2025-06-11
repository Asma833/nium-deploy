import { z } from 'zod';

// File validation schema
const fileSchema = z.object({
  file: z.instanceof(File),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
});

// Transaction form schema
export const transactionFormSchema = z.object({
  // Applicant Information
  applicantDetails: z.object({
    applicantName: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || (val.length >= 2 && val.length <= 100 && /^[a-zA-Z\s]*$/.test(val)),
        'Applicant name must be 2-100 characters and contain only letters and spaces'
      ),

    applicantPanNumber: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || (val.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val)),
        'Invalid PAN format (e.g., ABCDE1234F)'
      ),

    // Transaction Details
    transactionType: z.string().optional().or(z.literal('')),

    purposeType: z.string().optional().or(z.literal('')),
  }),
  // Document Uploads
  uploadDocuments: z.object({
    pan: z.array(fileSchema).optional().default([]),

    passportAadharDrivingVoter: z
      .object({
        front: z.array(fileSchema).optional().default([]),
        back: z.array(fileSchema).optional().default([]),
      })
      .optional()
      .default({ front: [], back: [] }),

    studentPassport: z
      .object({
        front: z.array(fileSchema).optional().default([]),
        back: z.array(fileSchema).optional().default([]),
      })
      .optional()
      .default({ front: [], back: [] }),

    studentUniversityOfferLetter: z.array(fileSchema).optional().default([]),

    studentVisa: z.array(fileSchema).optional().default([]),

    payerPan: z.array(fileSchema).optional().default([]),

    payerRelationshipProof: z.array(fileSchema).optional().default([]),

    educationLoanDocument: z.array(fileSchema).optional().default([]),

    otherDocuments: z.array(fileSchema).optional().default([]),
  }),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

// Strict validation schema for form submission
export const transactionFormSubmissionSchema = z.object({
  applicantDetails: z.object({
    applicantName: z
      .string()
      .min(2, 'Applicant name must be at least 2 characters')
      .max(100, 'Applicant name must not exceed 100 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Applicant name must contain only letters and spaces'),

    applicantPanNumber: z
      .string()
      .min(10, 'PAN number must be 10 characters')
      .max(10, 'PAN number must be 10 characters')
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)'),

    transactionType: z.string().min(1, 'Transaction type is required'),

    purposeType: z.string().min(1, 'Purpose is required'),
  }),

  uploadDocuments: z.object({
    pan: z.array(fileSchema).min(1, 'PAN document is required').max(3, 'Maximum 3 PAN documents allowed'),

    passportAadharDrivingVoter: z
      .object({
        front: z.array(fileSchema).optional(),
        back: z.array(fileSchema).optional(),
      })
      .optional(),

    studentPassport: z
      .object({
        front: z.array(fileSchema).optional(),
        back: z.array(fileSchema).optional(),
      })
      .optional(),

    studentUniversityOfferLetter: z.array(fileSchema).optional(),

    studentVisa: z.array(fileSchema).optional(),

    payerPan: z.array(fileSchema).optional(),

    payerRelationshipProof: z.array(fileSchema).optional(),

    educationLoanDocument: z.array(fileSchema).optional(),

    otherDocuments: z.array(fileSchema).optional(),
  }),
});

// Individual file validation for upload
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only PDF and image files are allowed' };
  }

  return { isValid: true };
};

// Transform file for form data
export const transformFileForForm = (file: File) => ({
  file,
  name: file.name,
  size: file.size,
  type: file.type,
  lastModified: file.lastModified,
});
