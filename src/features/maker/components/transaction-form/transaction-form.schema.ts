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

    email: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((val) => !val || z.string().email().safeParse(val).success, 'Invalid email format'),

    mobileNumber: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((val) => !val || /^[6-9]\d{9}$/.test(val), 'Invalid mobile number format (10 digits starting with 6-9)'),

    partnerOrderId: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((val) => !val || val.length >= 3, 'Partner Order ID must be at least 3 characters'),

    isVKycRequired: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((val) => !val || ['true', 'false'].includes(val), 'Please select Yes or No for V-KYC requirement'),

    // Transaction Details
    transactionType: z.string().optional().or(z.literal('')),

    purposeType: z.string().optional().or(z.literal('')),
  }),
  // Document Uploads
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

    email: z.string().email('Invalid email format').min(1, 'Email is required'),

    mobileNumber: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Invalid mobile number format (10 digits starting with 6-9)')
      .min(1, 'Mobile number is required'),

    partnerOrderId: z
      .string()
      .min(3, 'Partner Order ID must be at least 3 characters')
      .min(1, 'Partner Order ID is required'),
    isVKycRequired: z
      .string()
      .min(1, 'V-KYC selection is required')
      .refine((val) => ['true', 'false'].includes(val), 'Please select Yes or No for V-KYC requirement'),

    transactionType: z.string().min(1, 'Transaction type is required'),

    purposeType: z.string().min(1, 'Purpose is required'),
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
