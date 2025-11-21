/**
 * Common utility for data masking and validation
 * Provides functions for masking PAN, email addresses, mobile numbers, and validating admin domains
 */

/**
 * Mask PAN number showing only last 4 digits
 * @param pan - The PAN number to mask
 * @returns Masked PAN (e.g., "XXXXXX5678")
 */
export const maskPAN = (pan: string): string => {
  if (!pan || pan.length < 4) {
    return pan || '';
  }

  const lastFourDigits = pan.slice(-4);
  const maskedLength = pan.length - 4;
  const maskedPart = 'X'.repeat(maskedLength);

  return `${maskedPart}${lastFourDigits}`;
};

/**
 * Mask mobile number showing country code and only last 4 digits
 * @param mobile - The mobile number to mask (with or without country code)
 * @returns Masked mobile (e.g., "+91 ******1234" or "******1234")
 */
export const maskMobile = (mobile: string): string => {
  if (!mobile) {
    return '';
  }

  // Remove any spaces, hyphens, or parentheses for processing
  const cleanMobile = mobile.replace(/[\s\-()]/g, '');

  // Check if it starts with + (country code)
  const hasCountryCode = cleanMobile.startsWith('+');

  if (hasCountryCode) {
    // Extract country code (assuming it's 1-3 digits after +)
    const countryCodeMatch = cleanMobile.match(/^\+(\d{1,3})/);
    if (countryCodeMatch) {
      const countryCode = countryCodeMatch[0]; // e.g., "+91"
      const remainingNumber = cleanMobile.substring(countryCode.length);

      if (remainingNumber.length < 4) {
        return mobile; // Return as is if too short
      }

      const lastFourDigits = remainingNumber.slice(-4);
      const maskedLength = remainingNumber.length - 4;
      const maskedPart = 'X'.repeat(maskedLength);

      return `${countryCode} ${maskedPart}${lastFourDigits}`;
    }
  }

  // No country code - just mask showing last 4 digits
  if (cleanMobile.length < 4) {
    return mobile;
  }

  const lastFourDigits = cleanMobile.slice(-4);
  const maskedLength = cleanMobile.length - 4;
  const maskedPart = 'X'.repeat(maskedLength);

  return `${maskedPart}${lastFourDigits}`;
};

/**
 * Mask email address showing 1-2 characters before @ and full domain
 * @param email - The email address to mask
 * @returns Masked email (e.g., "j***@gmail.com" or "jo**@example.com")
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email || '';
  }

  const [localPart, domain] = email.split('@');

  if (localPart.length <= 2) {
    // If local part is 1-2 characters, show first character and mask rest
    const visibleChar = localPart.charAt(0);
    const maskedLocal = `${visibleChar}${'*'.repeat(Math.max(0, localPart.length - 1))}`;
    return `${maskedLocal}@${domain}`;
  } else {
    // If local part is longer, show first 2 characters and mask rest
    const visibleChars = localPart.slice(0, 2);
    const maskedLocal = `${visibleChars}${'x'.repeat(localPart.length - 2)}`;
    return `${maskedLocal}@${domain}`;
  }
};

/**
 * Allowed domains for NIUM Checker and Super Admin roles
 */
export const ALLOWED_ADMIN_DOMAINS = ['instarem.co.in', 'nium.com', 'niumforex.com'] as const;

export type AdminDomain = (typeof ALLOWED_ADMIN_DOMAINS)[number];

/**
 * Check if email domain is allowed for admin roles
 * @param email - The email address to check
 * @returns true if domain is allowed for admin roles
 */
export const isAllowedAdminDomain = (email: string): boolean => {
  if (!email || !email.includes('@')) {
    return false;
  }

  const domain = email.split('@')[1].toLowerCase();
  return ALLOWED_ADMIN_DOMAINS.includes(domain as AdminDomain);
};

/**
 * Validate email domain for NIUM Checker and Super Admin roles
 * @param email - The email address to validate
 * @returns Validation result with isValid flag and error message
 */
export const validateAdminEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!email.includes('@')) {
    return { isValid: false, error: 'Invalid email format' };
  }

  if (!isAllowedAdminDomain(email)) {
    return {
      isValid: false,
      error: `Email domain must be one of: ${ALLOWED_ADMIN_DOMAINS.join(', ')}`,
    };
  }

  return { isValid: true };
};

/**
 * Get domain from email address
 * @param email - The email address
 * @returns Domain part of email
 */
export const getEmailDomain = (email: string): string => {
  if (!email || !email.includes('@')) {
    return '';
  }
  return email.split('@')[1];
};

/**
 * Check if email belongs to agent or third party (not allowed for admin roles)
 * @param email - The email address to check
 * @returns true if email appears to be from external/agent domain
 */
export const isExternalEmail = (email: string): boolean => {
  if (!email || !email.includes('@')) {
    return true;
  }

  const domain = getEmailDomain(email).toLowerCase();
  return !ALLOWED_ADMIN_DOMAINS.includes(domain as AdminDomain);
};

/**
 * Comprehensive masking function that automatically detects data type
 * @param value - The value to mask
 * @param type - Type of data ('pan' | 'email' | 'mobile' | 'auto')
 * @returns Masked value
 */
export const maskData = (value: string, type: 'pan' | 'email' | 'mobile' | 'auto' = 'auto'): string => {
  if (!value) return value || '';

  switch (type) {
    case 'pan':
      return maskPAN(value);
    case 'email':
      return maskEmail(value);
    case 'mobile':
      return maskMobile(value);
    case 'auto':
    default:
      // Auto-detect based on content
      if (value.includes('@') && value.includes('.')) {
        return maskEmail(value);
      } else if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
        // Basic PAN pattern check
        return maskPAN(value);
      } else if (/^\+?\d+$/.test(value.replace(/[\s\-()]/g, ''))) {
        // Looks like a phone number
        return maskMobile(value);
      }
      return value;
  }
};

export default {
  maskPAN,
  maskEmail,
  maskMobile,
  maskData,
  isAllowedAdminDomain,
  validateAdminEmail,
  getEmailDomain,
  isExternalEmail,
  ALLOWED_ADMIN_DOMAINS,
};
