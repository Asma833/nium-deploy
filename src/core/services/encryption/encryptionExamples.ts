/**
 * Examples of how to control encryption for specific APIs
 *
 * This file demonstrates various ways to enable/disable encryption
 * for particular API endpoints or requests.
 */

import axiosInstance from '@/core/services/axios/axiosInstance';
import { EncryptedApiUtils } from './encryptedApiUtils';
import EncryptionControlUtils from './encryptionControlUtils';

export class EncryptionExamples {
  /**
   * Example 1: Use the centralized endpoint exclusions
   * These endpoints are automatically excluded via encryptionConfig.ts:
   * - /public-key, /health, /status
   * - /auth/login, /auth/logout, /auth/refresh
   * - api/v1/orders/get-checker-orders
   * - Any endpoints matching patterns like public API routes
   */
  static async publicEndpointExample() {
    // This will automatically skip encryption due to built-in exclusions
    const response = await axiosInstance.post('/auth/login', {
      username: 'user',
      password: 'pass',
    });
    return response;
  }

  /**
   * Example 2: Use header-based encryption control
   */
  static async headerControlExample() {
    // Skip encryption using header
    const response = await axiosInstance.post(
      '/api/user/profile',
      { name: 'John' },
      {
        headers: {
          'X-Skip-Encryption': 'true',
        },
      }
    );
    return response;
  }

  /**
   * Example 3: Use config-based encryption control
   */
  static async configControlExample() {
    // Skip encryption using config flag
    const response = await axiosInstance.post(
      '/api/user/settings',
      { theme: 'dark' },
      { skipEncryption: true } as any
    );
    return response;
  }

  /**
   * Example 4: Use EncryptionControlUtils for cleaner syntax
   */
  static async utilsControlExample() {
    // Skip encryption using utility function
    const response = await axiosInstance.post(
      '/api/user/preferences',
      { language: 'en' },
      EncryptionControlUtils.withoutEncryption()
    );
    return response;
  }

  /**
   * Example 5: Use EncryptedApiUtils convenience methods
   */
  static async encryptedApiUtilsExample() {
    // Always encrypted
    const encryptedResponse = await EncryptedApiUtils.encryptedPost(
      '/api/sensitive-data',
      {
        ssn: '123-45-6789',
      }
    );

    // Never encrypted
    const unencryptedResponse = await EncryptedApiUtils.unencryptedPost(
      '/api/public-data',
      {
        message: 'Hello World',
      }
    );

    // GET and DELETE are never encrypted anyway
    const getData = await EncryptedApiUtils.get('/api/users');
    const deleteData = await EncryptedApiUtils.delete('/api/users/123');

    return { encryptedResponse, unencryptedResponse, getData, deleteData };
  }
}

/**
 * Quick reference for encryption control:
 *
 * 1. GLOBAL CONTROL:
 *    - Set VITE_ENABLE_ENCRYPTION=false to disable all encryption
 *
 * 2. ENDPOINT EXCLUSIONS (in encryptionConfig.ts):
 *    - Add endpoints to SKIP_ENCRYPTION_ENDPOINTS array
 *    - Add patterns to SKIP_ENCRYPTION_PATTERNS array
 *
 * 3. PER-REQUEST CONTROL:
 *    - Use header: { headers: { 'X-Skip-Encryption': 'true' } }
 *    - Use config: { skipEncryption: true }
 *    - Use utils: EncryptionControlUtils.withoutEncryption()
 *
 * 4. CONVENIENCE METHODS:
 *    - EncryptedApiUtils.encryptedPost() - Always encrypted
 *    - EncryptedApiUtils.unencryptedPost() - Never encrypted
 *    - EncryptedApiUtils.get() - GET requests (never encrypted)
 *
 * 5. METHOD-BASED:
 *    - GET and DELETE are never encrypted
 *    - Only POST, PUT, PATCH are encrypted by default
 */

export default EncryptionExamples;
