/**
 * Encryption Test Utilities
 *
 * This file provides utilities to test AES-GCM encryption/decryption
 * with the backend implementation.
 */

import { encryptionService } from './encryptionService';

export interface BackendEncryptedResponse {
  encryptedKey: string;
  encryptedData: string;
  iv: string;
  authTag: string;
  aesKey?: string; // Raw AES key (required for decryption)
}

/**
 * Test decryption with a backend-generated encrypted payload
 *
 * @example
 * const backendResponse = {
 *   encryptedKey: "2125adc6806b0ca9...",
 *   encryptedData: "03863cdd911c248d...",
 *   iv: "7aa4ae64f850b449b7c3f0a6",
 *   authTag: "80cd97ccc8c2d2d0ce0eb4e42114df08",
 *   aesKey: "..." // Must be provided by backend
 * };
 *
 * const result = await testDecryption(backendResponse);
 * console.log('Decrypted:', result);
 */
export async function testDecryption(payload: BackendEncryptedResponse): Promise<any> {
  if (!payload.aesKey) {
    throw new Error(
      '❌ Backend must provide "aesKey" field for decryption. The encryptedKey cannot be decrypted in the browser without the private key.'
    );
  }

  try {
    const decryptedString = await encryptionService.decryptWithAES(
      payload.encryptedData,
      payload.aesKey,
      payload.iv,
      payload.authTag
    );

    // Try to parse as JSON
    try {
      const parsed = JSON.parse(decryptedString);
      return parsed;
    } catch {
      return decryptedString;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Test full encryption/decryption cycle
 *
 * @example
 * const testData = { message: 'Hello World', timestamp: Date.now() };
 * const result = await testEncryptionCycle(testData);
 * console.log('Original:', testData);
 * console.log('Decrypted:', result);
 */
export async function testEncryptionCycle(data: any): Promise<any> {
  try {
    // Encrypt
    const encrypted = await encryptionService.encryptPayload(data);
    // Decrypt
    const decrypted = await encryptionService.decryptResponse({
      encryptedData: encrypted.encryptedData,
      aesKey: encrypted.aesKey,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
    });
    // Verify data matches
    const originalJson = JSON.stringify(data);
    const decryptedJson = JSON.stringify(decrypted);

    if (originalJson === decryptedJson) {
      //   console.log('✅ Data integrity verified - original and decrypted match!');
    } else {
      // console.warn('⚠️ Data mismatch detected');
      // console.log('Original:', originalJson);
      // console.log('Decrypted:', decryptedJson);
    }

    return decrypted;
  } catch (error) {
    // console.error('❌ Encryption/decryption cycle failed:', error);
    throw error;
  }
}

/**
 * Validate backend encrypted response format
 */
export function validateBackendResponse(response: any): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!response.encryptedData) {
    errors.push('Missing required field: encryptedData');
  }
  if (!response.iv) {
    errors.push('Missing required field: iv');
  }
  if (!response.authTag) {
    errors.push('Missing required field: authTag');
  }

  // Check for AES key
  if (!response.aesKey) {
    errors.push('Missing required field: aesKey (backend must include raw AES key for decryption)');
  }

  // Validate hex format
  const hexRegex = /^[0-9a-fA-F]+$/;

  if (response.encryptedData && !hexRegex.test(response.encryptedData)) {
    errors.push('encryptedData is not a valid hex string');
  }
  if (response.iv && !hexRegex.test(response.iv)) {
    errors.push('iv is not a valid hex string');
  }
  if (response.authTag && !hexRegex.test(response.authTag)) {
    errors.push('authTag is not a valid hex string');
  }
  if (response.aesKey && !hexRegex.test(response.aesKey)) {
    errors.push('aesKey is not a valid hex string');
  }

  // Validate lengths
  if (response.iv && response.iv.length !== 24) {
    errors.push(`Invalid IV length: expected 24 hex chars (12 bytes), got ${response.iv.length}`);
  }
  if (response.authTag && response.authTag.length !== 32) {
    errors.push(`Invalid authTag length: expected 32 hex chars (16 bytes), got ${response.authTag.length}`);
  }
  if (response.aesKey && response.aesKey.length !== 32) {
    errors.push(`Invalid aesKey length: expected 32 hex chars (16 bytes), got ${response.aesKey.length}`);
  }

  // Warnings
  if (response.encryptedKey && !response.aesKey) {
    warnings.push(
      'Response contains encryptedKey but no aesKey. Frontend cannot decrypt RSA-encrypted keys without private key.'
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Example usage in browser console:
 *
 * import { testDecryption, validateBackendResponse } from '@/core/services/encryption/encryptionTestUtils';
 *
 * // Test with your backend response
 * const backendResponse = {
 *   encryptedKey: "2125adc6806b0ca9...",
 *   encryptedData: "03863cdd911c248d...",
 *   iv: "7aa4ae64f850b449b7c3f0a6",
 *   authTag: "80cd97ccc8c2d2d0ce0eb4e42114df08",
 *   aesKey: "..." // Backend must provide this
 * };
 *
 * // Validate format
 * const validation = validateBackendResponse(backendResponse);
 * console.log('Validation:', validation);
 *
 * // Test decryption
 * if (validation.valid) {
 *   const decrypted = await testDecryption(backendResponse);
 *   console.log('Decrypted:', decrypted);
 * }
 */

export default {
  testDecryption,
  testEncryptionCycle,
  validateBackendResponse,
};
