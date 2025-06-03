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
  applicantName: z
    .string()
    .min(2, 'Applicant name must be at least 2 characters')
    .max(100, 'Applicant name must not exceed 100 characters')
    .regex(
      /^[a-zA-Z\s]+$/,
      'Applicant name must contain only letters and spaces'
    ),

  applicantPanNumber: z
    .string()
    .min(10, 'PAN number must be 10 characters')
    .max(10, 'PAN number must be 10 characters')
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      'Invalid PAN format (e.g., ABCDE1234F)'
    ),

  // Transaction Details
  transactionType: z.string().min(1, 'Transaction type is required'),

  purpose: z.string().min(1, 'Purpose is required'),

  // Document Uploads
  panDocument: z
    .array(fileSchema)
    .min(1, 'PAN document is required')
    .max(3, 'Maximum 3 PAN documents allowed'),

  passportDocument: z
    .array(fileSchema)
    .min(1, 'Passport document is required')
    .max(3, 'Maximum 3 passport documents allowed'),

  universityOfferLetter: z
    .array(fileSchema)
    .min(1, 'University offer letter is required')
    .max(3, 'Maximum 3 university offer letters allowed'),

  studentVisa: z
    .array(fileSchema)
    .min(1, 'Student visa document is required')
    .max(3, 'Maximum 3 student visa documents allowed'),

  payerPanDocument: z.array(fileSchema).optional(),

  relationshipProof: z.array(fileSchema).optional(),

  educationLoanDocument: z.array(fileSchema).optional(),

  otherDocuments: z.array(fileSchema).optional(),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

// Individual file validation for upload
export const validateFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ];

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
