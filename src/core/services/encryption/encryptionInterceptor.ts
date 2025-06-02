import {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  encryptionService,
  EncryptionResult,
} from '@/core/services/encryption/encryptionService';
import {
  shouldSkipEncryption,
  shouldEncryptMethod,
} from '@/core/services/encryption/encryptionConfig';
import { encryptionLogger } from '@/core/services/encryption/encryptionLogger';

interface EncryptedRequestData {
  encryptedValue: string; // HEX_ENCRYPTED_AES_PAYLOAD
  encryptedKey: string; // HEX_RSA_ENCRYPTED_AES_KEY
  iv: string; // HEX_IV
  originalData?: any; // For debugging, remove in production
}

interface EncryptedResponseData {
  encryptedValue: string; // HEX_ENCRYPTED_AES_PAYLOAD (server response)
  success?: boolean;
  message?: string;
}

// Store AES keys and IVs for decrypting responses
const encryptionContext = new Map<string, { aesKey: string; iv: string }>();

/**
 * Request interceptor to encrypt outgoing data
 */
export const encryptRequestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  try {
    // Check if URL should skip encryption (using centralized config)
    const shouldSkipByUrl = shouldSkipEncryption(config.url || '');

    // Check for header-based encryption control
    const headerSkipEncryption =
      config.headers?.['X-Skip-Encryption'] === 'true';

    // Check for per-request encryption disable
    const configSkipEncryption = (config as any).skipEncryption === true;

    if (
      shouldSkipByUrl ||
      headerSkipEncryption ||
      configSkipEncryption ||
      !config.data ||
      !encryptionService.isEncryptionEnabled()
    ) {
      return config;
    }

    // Only encrypt specific HTTP methods with data (using centralized config)
    if (!shouldEncryptMethod(config.method || '')) {
      return config;
    }

    // Encrypt the request data
    const encryptionResult: EncryptionResult =
      await encryptionService.encryptPayload(config.data); // Store the AES key and IV for later decryption (use URL + timestamp as key)
    const contextKey = `${config.url}_${Date.now()}`;
    encryptionContext.set(contextKey, {
      aesKey: encryptionResult.aesKey, // Store the actual AES key used
      iv: encryptionResult.iv,
    });

    // Store context key in request config for response matching (using a custom property)
    (config as any).encryptionContextKey = contextKey; // Replace request data with encrypted payload
    const encryptedPayload: EncryptedRequestData = {
      encryptedValue: encryptionResult.encryptedData,
      encryptedKey: encryptionResult.encryptedAESKey,
      iv: encryptionResult.iv,
    };

    config.data = encryptedPayload;

    // Set appropriate headers
    if (config.headers) {
      config.headers['Content-Type'] = 'application/json';
      config.headers['X-Encryption-Enabled'] = 'true';
    }

    return config;
  } catch (error) {
    console.error('Error in request encryption interceptor:', error);
    // In case of encryption error, proceed with original request
    return config;
  }
};

/**
 * Response interceptor to decrypt incoming data
 */
export const decryptResponseInterceptor = (
  response: AxiosResponse
): AxiosResponse => {
  try {
    if (!encryptionService.isEncryptionEnabled()) {
      return response;
    }

    // Check if response contains encrypted data
    const responseData = response.data as EncryptedResponseData;
    if (
      !responseData ||
      typeof responseData !== 'object' ||
      !responseData.encryptedValue
    ) {
      return response;
    } // Get encryption context from request
    const contextKey = (response.config as any).encryptionContextKey;
    if (!contextKey) {
      console.warn('No encryption context found for response decryption');
      return response;
    }

    const encryptionCtx = encryptionContext.get(contextKey);
    if (!encryptionCtx) {
      console.warn('Encryption context not found for key:', contextKey);
      return response;
    }

    const decryptedData = encryptionService.decryptResponse({
      encryptedData: responseData.encryptedValue,
      aesKey: encryptionCtx.aesKey,
      iv: encryptionCtx.iv,
    });

    // Clean up encryption context
    encryptionContext.delete(contextKey); // Replace response data with decrypted data
    response.data = {
      ...responseData,
      ...decryptedData,
      encryptedValue: undefined, // Remove encrypted data from response
    };

    return response;
  } catch (error) {
    console.error('Error in response decryption interceptor:', error);
    // In case of decryption error, return original response
    return response;
  }
};

/**
 * Enhanced encryption-aware API client wrapper
 */
export class EncryptedApiClient {
  private static instance: EncryptedApiClient;
  private aesKey: string | null = null;
  private iv: string | null = null;

  static getInstance(): EncryptedApiClient {
    if (!EncryptedApiClient.instance) {
      EncryptedApiClient.instance = new EncryptedApiClient();
    }
    return EncryptedApiClient.instance;
  }
  /**
   * Encrypt data for API request
   */
  async encryptRequest(data: any): Promise<EncryptedRequestData> {
    const result = await encryptionService.encryptPayload(data);

    // Store for response decryption
    this.aesKey = result.aesKey; // Use the actual key from the result
    this.iv = result.iv;

    return {
      encryptedValue: result.encryptedData,
      encryptedKey: result.encryptedAESKey,
      iv: result.iv,
    };
  }

  /**
   * Decrypt API response
   */
  decryptResponse(encryptedData: string): any {
    if (!this.aesKey || !this.iv) {
      throw new Error('No encryption context available for decryption');
    }

    const result = encryptionService.decryptResponse({
      encryptedData,
      aesKey: this.aesKey,
      iv: this.iv,
    });

    // Clear context after use
    this.aesKey = null;
    this.iv = null;

    return result;
  }

  /**
   * Clear encryption context
   */
  clearContext(): void {
    this.aesKey = null;
    this.iv = null;
  }
}

export default {
  encryptRequestInterceptor,
  decryptResponseInterceptor,
  EncryptedApiClient,
};
